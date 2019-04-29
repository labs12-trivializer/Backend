const db = require('../data/db');

module.exports = {
  find,
  get,
  getById,
  update,
  insert
};

function find() {
  return db('questions');
}

async function get() {
  const questions = await find();
  return questions;
}

async function getById(id) {
  const question = await find()
    .where({ id })
    .first();
  return question;
}

async function update(id, changes) {
  return await db('questions')
    .where({ id })
    .update(changes)
    .then(() => getById(id));
}

async function insert(game) {
  return await db('questions')
    .insert(question, 'id')
    .then(ids => getById(ids[0]));
}
