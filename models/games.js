const db = require('../data/db');
const Joi = require('@hapi/joi');

module.exports = {
  get,
  getById,
  insert,
  find,
  update,
  validate,
  remove
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
async function remove(id) {
  return await db('games').where({id}).del();
}

function validate(user) {
  const schema = Joi.object().keys({
    name: Joi.string(),
    last_played: Joi.date().timestamp(),
    logo_url: Joi.string().uri()
  });

  return Joi.validate(user, schema);
}

