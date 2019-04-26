const db = require('../data/db');
const Joi = require('joi');

module.exports = {
  get,
  getById,
  insert,
  validate,
  find
};

function find() {
  return db('users');
}

async function get() {
  const users = await db('users');
  return users;
}

async function getById(id) {
  const user = await db('users')
    .where({ id })
    .first();
  return user;
}

async function insert(user) {
  return await db('users')
    .insert(user, 'id')
    .then(ids => getById(ids[0]));
}

function validate(user) {
  // joi schema
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .max(255)
      .required(),
    tier_id: Joi.number().integer(),
    logo_url: Joi.string().uri(),
    auth0_id: Joi.string().required(),
    avatar_url: Joi.string().uri()
  });

  return Joi.validate(user, schema);
}
