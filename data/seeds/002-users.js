const faker = require('faker');

faker.seed(123);

knownUserId = 'google-oauth2|101074967404865886144';

const randomItem = array => {
  return array[Math.floor(Math.random() * array.length)];
}

exports.seed = async function(knex) {
  const dbTiers = await knex('tiers');

  const users = [];
  for (let i = 0; i < 500; i++) {
    users.push({
      email: faker.internet.email(),
      avatar_url: faker.image.avatar(),
      logo_url: faker.image.abstract(),
      tier_id: randomItem(dbTiers).id
    });
  }

  users.push({
    email: 'test@test.com',
    auth0_id: knownUserId,
    tier_id: randomItem(dbTiers).id
  });

  await knex.batchInsert('users', users, 30);
};
