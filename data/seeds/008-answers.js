const faker = require('faker');

const randomItem = require('./helpers/randomItem');

faker.seed(123);

exports.seed = async function(knex) {
  const dbQuestions = await knex('questions');

  const answers = [];
  for(let i = 0; i < 1000; i++) {
    answers.push({
      text: faker.hacker.phrase(),
      question_id: randomItem(dbQuestions).id,
      is_correct: randomItem([true, false])
    });
  }

  await knex.batchInsert('answers', answers, 30);
};
