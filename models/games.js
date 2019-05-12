const db = require("../data/db");
const Joi = require("@hapi/joi");

module.exports = {
  get,
  find,
  remove,
  insert,
  update,
  getById,
  validate,
  nestedInsert,
  nestedUpdate,
  findWithCounts,
  findByIdAndUserId,
  findByIdAndUserIdNormalized
};

function find() {
  return db("games");
}

function findWithCounts() {
  const subquery = db("questions")
    .count("*")
    .leftJoin("rounds", "rounds.id", "=", "questions.round_id")
    .where("games.id", db.raw("??", ["rounds.game_id"]))
    .as("num_questions");

  return find()
    .select("games.*", subquery)
    .count("rounds.id AS num_rounds")
    .leftJoin("rounds", "rounds.game_id", "=", "games.id")
    .groupBy("games.id");
}

async function findByIdAndUserIdNormalized(id, user_id) {
  const game = await db("games")
    .where({ id })
    .where({ user_id })
    .first();

  if (!game) {
    return null;
  }
  const entities = {};

  const result = game.id;

  const rounds = await db("rounds").where({ game_id: game.id });

  game.rounds = rounds.map(r => r.id);

  entities.games = { [game.id]: game };

  const questions = await db("questions")
    .select(
      "questions.*",
    )
    .whereIn("round_id", rounds.map(r => r.id));

  const answers = await db("answers").whereIn(
    "question_id",
    questions.map(q => q.id)
  );

  entities.answers = answers.reduce((accu, cur) => {
    accu[cur.id] = cur;
    return accu;
  }, {});

  const answeredQuestions = questions.reduce((accu, cur) => {
    cur.answers = answers.filter(a => cur.id === a.question_id).map(a => a.id);

    accu[cur.id] = cur;
    return accu;
  }, {});

  entities.rounds = rounds.reduce((accu, cur) => {
    cur.questions = questions.filter(q => q.round_id === cur.id).map(q => q.id);
    accu[cur.id] = cur;
    return accu;
  }, {});

  entities.questions = answeredQuestions;

  return {
    entities,
    result
  };
}

async function findByIdAndUserId(id, user_id) {
  const game = await db("games")
    .where({ id })
    .where({ user_id })
    .first();

  if (!game) {
    return null;
  }

  const rounds = await db("rounds").where({ game_id: game.id });

  const questions = await db("questions").whereIn(
    "round_id",
    rounds.map(r => r.id)
  );

  const answers = await db("answers").whereIn(
    "question_id",
    questions.map(q => q.id)
  );

  const answeredQuestions = questions.map(q => ({
    ...q,
    answers: answers.filter(a => q.id === a.question_id)
  }));

  const questionedRounds = rounds.map(r => ({
    ...r,
    questions: answeredQuestions.filter(q => r.id === q.round_id)
  }));

  return {
    ...game,
    rounds: questionedRounds
  };
}

async function get() {
  const games = await find();
  return games;
}

async function getById(id) {
  const game = await find()
    .where({ id })
    .first();
  return game;
}

async function insert(game) {
  return await db("games")
    .insert(game, "id")
    .then(ids => getById(ids[0]));
}

async function update(id, changes) {
  return await db("games")
    .where({ id })
    .update(changes)
    .then(() => getById(id));
}
async function remove(id) {
  return await db("games")
    .where({ id })
    .del();
}

function validate(user) {
  const schema = Joi.object().keys({
    name: Joi.string(),
    last_played: Joi.date().timestamp(),
    logo_id: Joi.string(),
    date_to_be_played: Joi.string(),
    rounds: Joi.array()
  });

  return Joi.validate(user, schema);
}

// function to handle creating a new game with all of its
// related models
async function nestedInsert({ rounds: newRounds, ...newGame }) {
  // insert the newGame
  const createdGame = await insert(newGame);

  if (!newRounds || newRounds.length === 0) {
    return createdGame.id;
  }

  const createdRounds = await Promise.all(
    newRounds.map(({ questions: omit, ...r }) =>
      db("rounds")
        .insert({ game_id: createdGame.id, ...r }, "id")
        .then(ids =>
          db("rounds")
            .where({ id: ids[0] })
            .first()
        )
    )
  );

  // take all the rounds' questions and flatten them into one array
  // of questions we need to make
  // also set the round_id from our createdRounds
  const newQuestions = [].concat.apply(
    [],
    newRounds.reduce((accu, r, idx) => {
      if (r.questions) {
        return [
          ...accu,
          r.questions.map(q => ({ round_id: createdRounds[idx].id, ...q }))
        ];
      }

      return accu;
    }, [])
  );

  if (newQuestions.length === 0) {
    return createdGame.id;
  }

  // batch insert those newQuestions, omit the answers here
  const createdQuestions = await Promise.all(
    newQuestions.map(({ answers: omit, ...q }) =>
      db("questions")
        .insert(q, "id")
        .then(ids =>
          db("questions")
            .where({ id: ids[0] })
            .first()
        )
    )
  );

  // do the same for answers
  const newAnswers = [].concat.apply(
    [],
    newQuestions.reduce((accu, q, idx) => {
      if (q.answers) {
        return [
          ...accu,
          q.answers.map(a => ({ question_id: createdQuestions[idx].id, ...a }))
        ];
      }
      return accu;
    }, [])
  );

  if (newAnswers.length === 0) {
    return createdGame.id;
  }
  await db("answers").insert(newAnswers, "id");

  // return the id of the createdGame
  return createdGame.id;
}

// method that deletes a game's rounds, questions, and answers (via cascade)
// and replaces them with new ones
async function nestedUpdate(id, nestedGame) {
  const { rounds: newRounds, ...gameDetails } = nestedGame;
  const dbGame = await db("games")
    .where({ id })
    .update(gameDetails)
    .then(() => getById(id));

  if (!newRounds) {
    return dbGame.id;
  }

  // delete all of this game's rounds
  await db("rounds")
    .where({ game_id: dbGame.id })
    .del();

  // create new rounds, questions, and answers
  const createdRounds = await Promise.all(
    newRounds.map(({ id: omitId, questions: omit, ...r }) =>
      db("rounds")
        .insert({ ...r, game_id: dbGame.id }, "id")
        .then(ids =>
          db("rounds")
            .where({ id: ids[0] })
            .first()
        )
    )
  );

  // do the same for questions
  const newQuestions = [].concat.apply(
    [],
    newRounds.reduce((accu, r, idx) => {
      if (r.questions) {
        return [
          ...accu,
          r.questions.map(q => ({ round_id: createdRounds[idx].id, ...q }))
        ];
      }
      return accu;
    }, [])
  );

  if (newQuestions.length === 0) {
    return dbGame.id;
  }

  // batch insert those newQuestions, omit the answers here
  const createdQuestions = await Promise.all(
    newQuestions.map(({ answers: omit, ...q }) =>
      db("questions")
        .insert(q, "id")
        .then(ids =>
          db("questions")
            .where({ id: ids[0] })
            .first()
        )
    )
  );

  // do the same for answers
  const newAnswers = [].concat.apply(
    [],
    newQuestions.reduce((accu, q, idx) => {
      if (q.answers) {
        return [
          ...accu,
          q.answers.map(a => ({ question_id: createdQuestions[idx].id, ...a }))
        ];
      }
      return accu;
    }, [])
  );

  if (newAnswers.length === 0) {
    return dbGame.id;
  }
  await db("answers").insert(newAnswers, "id");

  // return the id of the updated Game
  return dbGame.id;
}
