exports.seed = async function(knex) {
  const setTypes = [
    'boolean',
    'multiple choice'
  ];

  const questionTypes = setTypes.map(t => ({
    name: t
  }));

  await knex.batchInsert('question_types', questionTypes, 30);
};
