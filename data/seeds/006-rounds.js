exports.seed = function(knex) {
  return knex('rounds').insert([
    {
      game_id: 1,
      number: 3,
    },
  ]);
};
