const db = require('../data/db');

module.exports = {
  find,
  get,
  getById,
  update,
  insert,
  deleteQuestion
};

function find() {
  return db('questions');
}

async function findByUserId(user_id) {
  const questions = await db('questions')
    .where({ user_id });

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
  const question = await find()
    .where({ id })
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
