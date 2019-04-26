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
      //Users table
      .createTable('users', tbl => {
        tbl.increments();
        tbl
          .integer('tier_id')
          .unsigned()
          .references('id')
          .inTable('tiers')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
        tbl
          .string('email', 128)
          .notNullable()
          .unique();
        tbl.string('logo_url', 400);
        tbl.string('stripe_customer_id', 400);
      })
      .createTable('categories', tbl => {
        tbl.increments();
        tbl
          .integer('user_id')
          .unsigned.references('id')
          .inTable('users')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
        tbl.string('name', 128);
        tbl.timestamp('timestamps').defaultTo(knex.fn.now());
      })
      .createTable('games', tbl => {
        tbl.increments();
        tbl.string('name', 128).notNullable();
        tbl.timestamp('timestamps').defaultTo(knex.fn.now());
        tbl.string('last_played', 128).notNullable();
        tbl
          .integer('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
        tbl.string('logo_url', 400);
      })
  );
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tiers');
};
