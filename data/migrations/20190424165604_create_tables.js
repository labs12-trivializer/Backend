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
      //Categories Table
      .createTable('categories', tbl => {
        tbl.increments();
        tbl
          .integer('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
        tbl.string('name', 128);
        tbl.timestamp('timestamps').defaultTo(knex.fn.now());
      })
      //Games Table
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
      //Rounds table
      .createTable('rounds', tbl => {
        tbl.increments();
        tbl
          .integer('game_id')
          .unsigned()
          .references('id')
          .inTable('games')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
        tbl.timestamp('timestamps').defaultTo(knex.fn.now());
        tbl.integer('number').notNullable();
      })
      //Question types table
      .createTable('question_types', tbl => {
        tbl.increments();
        tbl
          .integer('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('CASCASDE')
          .onUpdate('CASCADE');
        tbl.string('name', 128);
        tbl.timestamp('timestamps').defaultTo(knex.fn.now());
      })

      //Questions table
      .createTable('questions', tbl => {
        tbl.increments();
        tbl
          .integer('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
        tbl
          .integer('question_type_id')
          .unsigned()
          .references('id')
          .inTable('question_types')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
        tbl
          .integer('category_id')
          .unsigned()
          .references('id')
          .inTable('categories')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
      })
  );
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tiers');
};
