const db = require('../data/db');

module.exports = {
  get,
  getById,
};

async function get() {
  const tiers = await db('tiers');
  return tiers;
}

async function getById(id) {
  const tier = await db('tiers').where({ id });
  return tier;
}
