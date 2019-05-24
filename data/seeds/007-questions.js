const faker = require('faker');

const randomItem = require('./helpers/randomItem');

faker.seed(123);

exports.seed = async function(knex) {
  const dbQuestionTypes = await knex('question_types');
  const dbCategories = await knex('categories');
  const dbRounds = await knex('rounds');

  const questions = [];

  for(let i = 0; i < 300; i++) {
    questions.push({
      question_type_id: dbQuestionTypes[1].id,
      category_id: randomItem(dbCategories).id,
      round_id: randomItem(dbRounds).id,
      difficulty: randomItem(['easy']),
      text: faker.company.catchPhrase() + '?'
    });
  }

  await knex.batchInsert('questions', questions, 30);
};

