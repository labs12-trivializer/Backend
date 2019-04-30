const Joi = require('@hapi/joi');
const db = require('../data/db');

module.exports = {
  add: answer => db('answers').insert(answer).returning('id'),

  get: async (id) => {
    let query = db('answers');
    if (id) query = query.where({ id });
    return query;
  },

  filter: query => db('answers').where(query),

  update: (id, changes) => db('answers').where({ id }).update(changes),

  remove: id => db('answers').where({ id }).del(),

  schema: async (answer, post) => {
    let schema = {
      question_id: Joi.number().integer().positive().required(),
      text: Joi.string().max(128),
      is_correct: Joi.boolean()
    };

    if (post) {
      schema = Object.assign(schema, {
        text: Joi.string().max(128).required(),
        is_correct: Joi.boolean().required()
      });
    }

    return Joi.validate(answer, schema);
  }
};

