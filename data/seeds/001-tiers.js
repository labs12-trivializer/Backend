exports.seed = function(knex) {
  return knex('tiers').insert([
    {
      name: 'bronze',
      game_limit: 1,
      round_limit: 2,
      question_limit: 4,
      stripe_product_id: null,
      stripe_plan_id: null,
    },
    {
      name: 'silver',
      game_limit: 10,
      round_limit: 4,
      question_limit: 20,
      stripe_product_id: 'prod_Eyw8sepUtUWsZ4',
      stripe_plan_id: 'plan_Eyw8BcuV5qyAV2',
    },
    {
      name: 'gold',
      game_limit: 30,
      round_limit: 10,
      question_limit: 200,
      stripe_product_id: 'prod_Eyw95cKae2d39F',
      stripe_plan_id: 'plan_Eyw9DUPvzcFMvK',
    },
  ]);
};
