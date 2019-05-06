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
  findWithCounts,
  findByIdAndUserId,
  findByIdAndUserIdNormalized
};

function find() {
  return db('games');
}

function findWithCounts() {
  const subquery = db('questions')
    .count('*')
    .leftJoin('rounds', 'rounds.id', '=', 'questions.round_id')
    .where('games.id', db.raw('??', ['rounds.game_id']))
    .as('num_questions');
  return find()
    .select('games.*', subquery)
    .count('rounds.id AS num_rounds')
    .leftJoin('rounds', 'rounds.game_id', '=', 'games.id')
    .groupBy('games.id');
}

async function findByIdAndUserIdNormalized(id, user_id) {
  const game = await db('games')
    .where({ id })
    .where({ user_id })
    .first();

  if (!game) {
    return null;
  }
  const entities = {};

  const result = game.id;

  const rounds = await db('rounds').where({ game_id: game.id });

  game.rounds = rounds.map(r => r.id);

  entities.games = { [game.id]: game };

  const questions = await db('questions')
    .select('questions.*', 'question_types.name as question_type')
    .leftJoin(
      'question_types',
      'questions.question_type_id',
      '=',
      'question_types.id'
    )
    .whereIn('round_id', rounds.map(r => r.id));

  const answers = await db('answers').whereIn(
    'question_id',
    questions.map(q => q.id)
  );

  entities.answers = answers.reduce((accu, cur) => {
    accu[cur.id] = cur;
    return accu;
  }, {});

  const answeredQuestions = questions.reduce((accu, cur) => {
    cur.answers = answers.filter(a => cur.id === a.question_id).map(a => a.id);

    accu[cur.id] = cur;
    return accu;
  }, {});

  entities.rounds = rounds.reduce((accu, cur) => {
    cur.questions = questions.filter(q => q.round_id === cur.id).map(q => q.id);
    accu[cur.id] = cur;
    return accu;
  }, {});

  entities.questions = answeredQuestions;

  return {
    entities,
    result
  };
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
    answers: answers.filter(a => q.id === a.question_id)
  }));

  const questionedRounds = rounds.map(r => ({
    ...r,
    questions: answeredQuestions.filter(q => r.id === q.round_id)
  }));

  return {
    ...game,
    rounds: questionedRounds
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
    logo_id: Joi.string()
  });

  return Joi.validate(user, schema);
}
