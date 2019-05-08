const db = require('../data/db');

module.exports = {
  get,
  find,
  insert,
  update,
  getById,
  deleteItem,
  withUserId,
  nestedUpdate,
  findWithCounts,
  findByIdNormalized
};

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
    .select(
      'questions.*',
      'question_types.name as question_type',
      'categories.name as category'
    )
    .leftJoin('categories', 'categories.id', '=', 'questions.category_id')
    .leftJoin(
      'question_types',
      'questions.question_type_id',
      '=',
      'question_types.id'
    )
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

  if(!newQuestions) {
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
          q.answers.map(a => ({ question_id: createdQuestions[idx].id, ...a }))
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
