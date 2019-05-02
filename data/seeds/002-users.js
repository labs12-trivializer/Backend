const faker = require('faker');

const randomItem = require('./helpers/randomItem');

faker.seed(123);

knownUserIds = [
  'google-oauth2|101074967404865886144',
  'auth0|5cc3a15c613fb90e0f1d00bc',
  'auth0|5cc3a1837b2e2711e4ab656b'
];

goldId = 'auth0|5cc3a234a32cf50eb0e7ad69';
silverId = 'auth0|5cc3a1da2ae95a1148a02792';
bronzeId = 'auth0|5cc3a1a928671f107e999a8c';

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

  // Add test accounts
  users.push({
    email: 'lambda.trivializer@gmail.com',
    auth0_id: knownUserIds[0],
    tier_id: randomItem(dbTiers).id
  });

  users.push({
    email: 'test2@test.com',
    auth0_id: knownUserIds[1],
    tier_id: randomItem(dbTiers).id
  });

  users.push({
    email: 'test3@test.com',
    auth0_id: knownUserIds[2],
    tier_id: randomItem(dbTiers).id
  });

  users.push({
    email: 'bronze@test.com',
    auth0_id: bronzeId,
    tier_id: dbTiers[0].id
  });

  users.push({
    email: 'silver@test.com',
    auth0_id: silverId,
    tier_id: dbTiers[1].id
  });

  users.push({
    email: 'gold@test.com',
    auth0_id: goldId,
    tier_id: dbTiers[2].id
  });

  await knex.batchInsert('users', users, 30);
};
