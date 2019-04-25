exports.seed = function(knex) {
  return knex('tiers').insert([
    {
      name: 'bronze',
      game_limit: 1,
      round_limit: 2,
      question_limit: 10,
      stripe_product_id: 'loremipsum',
      stripe_plan_id: 'loremipsum',
    },
    {
      name: 'silver',
      game_limit: 10,
      round_limit: 4,
      question_limit: 30,
      stripe_product_id: 'loremipsum',
      stripe_plan_id: 'loremipsum',
    },
    {
      name: 'gold',
      game_limit: 30,
      round_limit: 10,
      question_limit: 200,
      stripe_product_id: 'loremipsum',
      stripe_plan_id: 'loremipsum',
    },
  ]);
};
