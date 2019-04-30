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

async function get() {
  const questions = await find();
  return questions;
}

async function getById(id) {
  return await find()
    .where({ id })
    .first();
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
