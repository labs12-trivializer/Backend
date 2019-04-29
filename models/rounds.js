const db = require('../data/db');

module.exports = {
  get,
  insert,
  getById,
  update,
  deleteItem,
};

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
