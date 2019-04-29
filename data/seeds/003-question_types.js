exports.seed = async function(knex) {
  const setTypes = [
    'true/false',
    'multiple choice',
    'fill-in the blank'
  ];

  const questionTypes = setTypes.map(t => ({
    name: t
  }));

  await knex.batchInsert('question_types', questionTypes, 30);
};
