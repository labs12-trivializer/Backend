const faker = require('faker');

const randomItem = require('./helpers/randomItem');

faker.seed(123);

exports.seed = async function(knex) {
  const dbQuestionTypes = await knex('question_types');
  const dbCategories = await knex('categories');
  const dbRounds = await knex('rounds');
  const dbUsers = await knex('users').whereNotNull('auth0_id');

  const questions = [];

  for(let i = 0; i < 300; i++) {
    questions.push({
      question_type_id: randomItem(dbQuestionTypes).id,
      category_id: randomItem(dbCategories).id,
      round_id: randomItem(dbRounds).id,
      user_id: randomItem(dbUsers).id,
      difficulty: randomItem(['easy', 'medium', 'hard']),
      text: faker.hacker.phrase()
    });
  }

  await knex.batchInsert('questions', questions, 30);
};

