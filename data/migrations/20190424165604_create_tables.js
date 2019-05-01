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
        tbl.timestamps(true, true);
        tbl.integer('game_limit').notNullable();
        tbl.integer('round_limit').notNullable();
        tbl.integer('question_limit').notNullable();
        tbl.string('stripe_product_id').notNullable();
        tbl.string('stripe_plan_id');
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
        tbl.string('avatar_url', 400);
        tbl.string('stripe_customer_id', 400);
        tbl.string('auth0_id', 255);
      })
      //Categories Table
      .createTable('categories', tbl => {
        tbl.increments();
        tbl
          .integer('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .nullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
        tbl.string('name', 128).notNullable();
        tbl
          .integer('category_id')
          .unsigned()
          .notNullable();
      })
      //Games Table
      .createTable('games', tbl => {
        tbl.increments();
        tbl.string('name', 128).notNullable();
        tbl.timestamps(true, true);
        tbl.timestamp('last_played').defaultTo(knex.fn.now());
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
        tbl.timestamps(true, true);
        tbl.integer('number').notNullable();
      })
      //Question types table
      .createTable('question_types', tbl => {
        tbl.increments();
        tbl.string('name', 128);
      })
      //Questions table
      .createTable('questions', tbl => {
        tbl.increments();
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
        tbl.string('text', 128).notNullable();
        tbl.string('difficulty', 128);
        tbl.timestamps(true, true);
        tbl
          .integer('round_id')
          .unsigned()
          .references('id')
          .inTable('rounds')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
      })
      //Answers table
      .createTable('answers', tbl => {
        tbl.increments();
        tbl
          .integer('question_id')
          .unsigned()
          .references('id')
          .inTable('questions')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
        tbl.string('text', 128).notNullable();
        tbl.boolean('is_correct').notNullable();
      })
  );
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('answers')
    .dropTableIfExists('questions')
    .dropTableIfExists('question_types')
    .dropTableIfExists('rounds')
    .dropTableIfExists('games')
    .dropTableIfExists('categories')
    .dropTableIfExists('users')
    .dropTableIfExists('tiers');
};
