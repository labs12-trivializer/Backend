exports.up = function(knex) {
  return (
    knex.schema
      //Tiers Table
      .createTable('tiers', tbl => {
        tbl.increments();
        tbl
          .string('name', 128)
          .notNullable()
          .unique();
        tbl.timestamp('timestamps').defaultTo(knex.fn.now());
        tbl.integer('game_limit').notNullable();
        tbl.integer('round_limit').notNullable();
        tbl.integer('question_limit').notNullable();
        tbl.string('stripe_product_id').notNullable();
        tbl.string('stripe_plan_id').notNullable();
      })
  );
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tiers');
};
