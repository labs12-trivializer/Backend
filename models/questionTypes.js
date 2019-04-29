const db = require('../data/db');

module.exports = {
  get,
  getById,
  insert,
  find,
  update
};

function find() {
  return db('question_types');
}

async function get() {
  const questionTypes = await find();
  return questionTypes;
}

async function getById(id) {
  const questionType = await find()
    .where({ id })
    .first();
  return questionType;
}

async function insert(questionType) {
  return await db('question_types')
    .insert(questionType, 'id')
    .then(ids => getById(ids[0]));
}

async function update(id, changes) {
  return await db('question_types')
    .where({ id })
    .update(changes)
    .then(() => getById(id));
}
