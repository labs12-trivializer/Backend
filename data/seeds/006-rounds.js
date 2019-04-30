const randomItem = require('./helpers/randomItem');

exports.seed = async function(knex) {
  const dbGames = await knex('games');

  const rounds = [];
  const roundCounts = {};

  for(let i = 0; i < 50; i++) {
    const thisId = randomItem(dbGames).id;
    const thisRound = roundCounts[thisId] ? roundCounts[thisId] + 1 : 1;
    roundCounts[thisId] = thisRound;

    rounds.push({
      game_id: thisId,
      number: thisRound
    });
  }

  await knex.batchInsert('rounds', rounds, 30);
};

