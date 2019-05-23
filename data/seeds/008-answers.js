const faker = require('faker');

const randomItem = require('./helpers/randomItem');

faker.seed(123);

exports.seed = async function(knex) {
  const dbQuestions = await knex('questions');

  const answerCounts = {};
  const answers = [];
  for (let i = 0; i < 1000; i++) {
    let thisQuestion = randomItem(dbQuestions).id;
    while (
      answerCounts[thisQuestion] &&
      answerCounts[thisQuestion] > 3
    ) {
      thisQuestion = randomItem(dbQuestions).id;
    }

    answers.push({
      text: faker.hacker.phrase(),
      question_id: thisQuestion,
      is_correct: randomItem([true, false])
    });
    answerCounts[thisQuestion] =
      typeof answerCounts[thisQuestion] !== 'undefined'
        ? answerCounts[thisQuestion] + 1
        : 1;
  }

  await knex.batchInsert('answers', answers, 30);
};
