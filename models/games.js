const db = require('../data/db');
const Joi = require('@hapi/joi');

module.exports = {
  get,
  getById,
  insert,
  find,
  update,
  validate,
  remove,
  findByIdAndUserId,
};

function find() {
  return db('games');
}

async function findByIdAndUserId(id, user_id) {
  const game = await db('games')
    .where({ id })
    .where({ user_id })
    .first();

  if (!game) {
    return null;
  }

  const rounds = await db('rounds').where({ game_id: game.id });

  const questions = await db('questions').whereIn(
    'round_id',
    rounds.map(r => r.id)
  );

  const answers = await db('answers').whereIn(
    'question_id',
    questions.map(q => q.id)
  );

  const answeredQuestions = questions.map(q => ({
    ...q,
    answers: answers.filter(a => q.id === a.question_id),
  }));

  const questionedRounds = rounds.map(r => ({
    ...r,
    questions: answeredQuestions.filter(q => r.id === q.round_id),
  }));

  return {
    ...game,
    rounds: questionedRounds,
  };
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
  return await db('games')
    .where({ id })
    .del();
}

function validate(user) {
  const schema = Joi.object().keys({
    name: Joi.string(),
    last_played: Joi.date().timestamp(),
    logo_url: Joi.string().uri(),
  });

  return Joi.validate(user, schema);
}
