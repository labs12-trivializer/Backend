exports.seed = knex =>
  knex('answers').insert([
    {
      question_id: 1,
      text: 'true',
      is_correct: true
    },
    {
      question_id: 1,
      text: 'false',
      is_correct: false
    }
  ]);
