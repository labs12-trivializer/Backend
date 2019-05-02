const db = require('../data/db.js');

module.exports = {
  saveStripeId,
};

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
