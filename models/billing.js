const db = require('../data/db.js');

module.exports = {
  saveStripeId,
  updateTier,
};

// save stripe_customer_id associated with user in 'user' table
async function saveStripeId(id, stripe_customer_id) {
  try {
    await db('users')
      .where({ id })
      .update({ stripe_customer_id });
    return;
  } catch (error) {
    return error;
  }
}
//updates tier_id in 'users' table
async function updateTier(id, tier) {
  try {
    await db('users')
      .where({ id })
      .update({ tier_id: tier });
    return;
  } catch (error) {
    return error;
  }
}
