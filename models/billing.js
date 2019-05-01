const db = require('../data/db');

module.exports = {
  saveStripeId,
};

async function saveStripeId(id, stripeId) {
  const savedInfo = await db('users')
    .where({ id })
    .insert({ stripe_customer_id: stripeId });
  return;
}
