const db = require('../data/db');

module.exports = {
  get,
  getById,
  insert,
  find,
  update
};

function find() {
  return db('games');
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
  return await db('games')
    .insert(game, 'id')
    .then(ids => getById(ids[0]));
}

async function update(id, changes) {
  return await db('games')
    .where({ id })
    .update(changes)
    .then(() => getById(id));
}
