const db = require('../data/db');
const Joi = require('joi');

module.exports = {
  get,
  getById,
  insert,
  validate,
  find,
  update
};

function find() {
  return db('categories');
}

async function get() {
  const categories = await find();
  return categories;
}

async function getById(id) {
  const category = await find()
    .where({ id })
    .first();
  return category;
}

async function insert(category) {
  return await db('categories')
    .insert(category, 'id')
    .then(ids => getById(ids[0]));
}

async function update(id, changes) {
  return await db('categories')
    .where({ id })
    .update(changes)
    .then(() => getById(auth0_id));
}

function validate(category) {
  // joi schema
  const schema = Joi.object().keys({
    email: Joi.string()
      .string()
      .max(255)
      .required(),
    user_id: Joi.number().integer(),
  });

  return Joi.validate(category, schema);
}

