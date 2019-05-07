const db = require('../data/db');

module.exports = {
  find,
  get,
  getById,
  update,
  insert,
  deleteQuestion,
  findByUserId,
  findByIdNormalized,
  withUserId
};

function find() {
  return db('questions');
}

function withUserId(queryBuilder, user_id) {
  return queryBuilder
    .select(
      'questions.*',
      'question_types.name as question_type',
      'categories.name as category'
    )
    .leftJoin(
      'question_types',
      'questions.question_type_id',
      '=',
      'question_types.id'
    )
    .leftJoin('categories', 'categories.id', '=', 'questions.category_id')
    .leftJoin('rounds', 'rounds.id', '=', 'questions.round_id')
    .leftJoin('games', 'games.id', '=', 'rounds.game_id')
    .where('games.user_id', user_id);
}

async function findByIdNormalized(id, user_id) {
  const question = await db('questions')
    .modify(withUserId, user_id)
    .where('questions.id', id)
    .first();

  if (!question) {
    return null;
  }
  const entities = {};

  const result = question.id;

  const answers = await db('answers').where({ question_id: question.id });

  question.answers = answers.map(a => a.id);

  entities.answers = answers.reduce((accu, cur) => {
    accu[cur.id] = cur;
    return accu;
  }, {});

  entities.questions = { [question.id]: question };

  return {
    entities,
    result
  };
}

async function findByUserId(user_id) {
  const questions = await db('questions').where({ user_id });

  if (!questions) {
    return null;
  }

  const answers = await db('answers').whereIn(
    'question_id',
    questions.map(q => q.id)
  );

  return questions.map(q => ({
    ...q,
    answers: answers.filter(a => q.id === a.question_id)
  }));
}

async function get() {
  const questions = await find();
  return questions;
}

async function getById(id) {
  const question = await find().where({ id });
  return question;
}

async function update(id, changes) {
  return await db('questions')
    .where({ id })
    .update(changes)
    .then(() => getById(id));
}

async function insert(question) {
  return await db('questions')
    .insert(question, 'id')
    .then(ids => getById(ids[0]));
}

async function deleteQuestion(id) {
  return await db('questions')
    .where({ id })
    .del();
}
