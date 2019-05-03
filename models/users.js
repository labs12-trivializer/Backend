const db = require('../data/db');
const Joi = require('@hapi/joi');

module.exports = {
  get,
  getById,
  insert,
  schema,
  find,
  getByAuth0Id,
  update,
};

function find() {
  return db('users')
    .leftJoin('tiers', 'tiers.id', '=', 'users.tier_id')
    .select(
      'tiers.name as tier_name',
      'users.email',
      'users.logo_id',
      'users.avatar_id',
      'users.id',
      'users.tier_id',
      'users.auth0_id'
    );
}

async function get() {
  const users = await find();
  return users;
}

async function getById(id) {
  const user = await find()
    .where({ id })
    .first();
  return user;
}

async function getByAuth0Id(auth0_id) {
  const user = await find()
    .where({ auth0_id })
    .first();
  return user;
}

async function insert(user) {
  return await db('users')
    .insert(user, 'id')
    .then(ids => getById(ids[0]));
}

async function update(auth0_id, changes) {
  return await db('users')
    .where({ auth0_id })
    .update(changes)
    .then(() => getByAuth0Id(auth0_id));
}

function schema(user, post) {
  let schema = {
    email: Joi.string()
      .email()
      .max(255),
    tier_id: Joi.number().integer(),
    logo_id: Joi.string(),
    avatar_id: Joi.string()
  }

  // joi schema
  if (post) schema = Object.assign(schema, {
    email: Joi.string()
      .email()
      .max(255)
      .required()
  })

  return Joi.validate(user, schema);
}
