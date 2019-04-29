const faker = require('faker');

faker.seed(123);

const randomItem = array => {
  return array[Math.floor(Math.random() * array.length)];
};

exports.seed = async function(knex) {
  // get an array of users with valid auth0_ids
  const dbUsers = await knex('users').whereNotNull('auth0_id');

  const games = [];

  for(let i = 0; i < 400; i++) {
    games.push({
      name: faker.commerce.productName(),
      user_id: randomItem(dbUsers).id,
      logo_url: faker.image.business(),
      last_played: faker.date.recent()
    });
  }

  await knex.batchInsert('games', games, 30);
};
