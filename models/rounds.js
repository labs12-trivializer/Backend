const db = require('../data/db');
const Joi = require('@hapi/joi');

module.exports = {
  get,
  find,
  schema,
  insert,
  update,
  getById,
  deleteItem,
  withUserId,
  nestedInsert,
  nestedUpdate,
  validateTier,
  findWithCounts,
  findByIdNormalized
};

function schema(round, post) {
  let thisSchema = {
    game_id: Joi.number()
      .integer()
      .positive(),
    number: Joi.number().integer(),
    questions: Joi.array()
  };

  if (post) {
    thisSchema = {
      ...thisSchema,
      game_id: Joi.number()
        .integer()
        .positive()
        .required()
    };
  }
  return Joi.validate(round, thisSchema, { stripUnknown: true });
}

function find() {
  return db('rounds');
}

function findWithCounts() {
  return find()
    .select('rounds.*')
    .count('questions.id AS num_questions')
    .leftJoin('questions', 'questions.round_id', '=', 'rounds.id')
    .groupBy('rounds.id');
}

function withUserId(queryBuilder, user_id) {
  return queryBuilder
    .select('rounds.*')
    .leftJoin('games', 'games.id', '=', 'rounds.game_id')
    .where('games.user_id', user_id);
}

async function findByIdNormalized(id, user_id) {
  const round = await db('rounds')
    .modify(withUserId, user_id)
    .where('rounds.id', id)
    .first();

  if (!round) {
    return null;
  }
  const entities = {};

  const result = round.id;

  const questions = await db('questions')
    .select('questions.*')
    .where({ round_id: round.id });

  round.questions = questions.map(r => r.id);

  entities.rounds = { [round.id]: round };

  const answers = await db('answers').whereIn(
    'question_id',
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

  entities.questions = answeredQuestions;

  return {
    entities,
    result
  };
}

async function get() {
  const rounds = await db('rounds');
  return rounds;
}

async function getById(id) {
  const round = await db('rounds')
    .where({ id })
    .first();
  return round;
}

async function insert(round) {
  return await db('rounds')
    .insert(round, 'id')
    .then(ids => getById(ids[0]));
}

async function update(id, changes) {
  return await db('rounds')
    .where({ id })
    .update(changes)
    .then(() => getById(id));
}

async function deleteItem(id) {
  return await db('rounds')
    .where({ id })
    .del();
}

// method that deletes a round's questions and answers (via cascade)
// and replaces them with new questions and answers
async function nestedUpdate(id, nestedRound) {
  const { questions: newQuestions, ...roundDetails } = nestedRound;
  const dbRound = await db('rounds')
    .where({ id })
    .update(roundDetails)
    .then(() => getById(id));

  if (!newQuestions) {
    return dbRound.id;
  }

  // delete all of this rounds questions
  await db('questions')
    .where({ round_id: dbRound.id })
    .del();

  // create new questions and answers
  const createdQuestions = await Promise.all(
    newQuestions.map(({ id: omitId, answers: omit, ...q }) =>
      db('questions')
        .insert({ ...q, round_id: dbRound.id }, 'id')
        .then(ids =>
          db('questions')
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
          q.answers.map(a => ({ ...a, question_id: createdQuestions[idx].id }))
        ];
      }
      return accu;
    }, [])
  );

  if (newAnswers.length === 0) {
    return dbRound.id;
  }

  await db('answers').insert(newAnswers, 'id');

  return dbRound.id;
}

// insert a new round with optional nested questions and answers
async function nestedInsert({ questions: newQuestions, ...newRound }) {
  const createdRound = await insert(newRound);

  if (!newQuestions || newQuestions.length === 0) {
    return createdRound.id;
  }

  const createdQuestions = await Promise.all(
    newQuestions.map(({ answers: omit, ...r }) =>
      db('questions')
        .insert({ ...r, round_id: createdRound.id }, 'id')
        .then(ids =>
          db('questions')
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
          q.answers.map(a => ({ ...a, question_id: createdQuestions[idx].id }))
        ];
      }
      return accu;
    }, [])
  );

  if (newAnswers.length === 0) {
    return createdRound.id;
  }
  await db('answers').insert(newAnswers, 'id');

  // return the id of the createdGame
  return createdRound.id;
}

async function validateTier(game_id, user_id) {
  //get game limit based on current tier
  const { round_limit } = await db('users')
    .join('tiers', 'users.tier_id', 'tiers.id')
    .select('users.tier_id', 'users.id', 'tiers.round_limit')
    .where({ 'users.id': user_id })
    .first();

  //get count of number of rounds associated with game_id
  const { 'count(*)': roundCount } = await db('rounds')
    .where({ game_id })
    .count()
    .first();

  //compare roundCount vs round_limit and if it is the same or greater, stop from creating new game
  if (roundCount >= round_limit) {
    return { status: 406 };
  } else {
    return { status: 200 };
  }
}
