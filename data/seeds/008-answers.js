const faker = require('faker');

const randomItem = require('./helpers/randomItem');

faker.seed(123);

exports.seed = async function(knex) {
  const dbQuestions = await knex('questions');

  const answers = [];

  // for each question, add a correct answer, then 3 incorrect ones

  dbQuestions.forEach(q => {
    const correctIndex = faker.random.number(3);
    const correctAnswer = {
      text: faker.company.bs(),
      question_id: q.id,
      is_correct: true
    };

    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        answers.push(correctAnswer);
      } else {
        answers.push({
          text: faker.company.bs(),
          question_id: q.id,
          is_correct: false
        });
      }
    }
  });

  await knex.batchInsert('answers', answers, 30);
};
