const router = require('express').Router();
// Set your secret key: remember to change this to your live secret key in production
const key = process.env.SECRET_STRIPE_KEY;
const stripe = require('stripe')(key);
const Billing = require('../models/billing');

//creating Customer associated with our Stripe account:
router.post('/customer', (req, res) => {
  //customer object from frontend
  const { name, email, description, source } = req.body;
  //create customer with details sent from frontend
  stripe.customers.create(
    {
      name,
      email,
      description,
      source,
    },
    function(err, customer) {
      // asynchronously called
      if (err) {
        res.status(404).json(err);
      } else {
        res.status(200).json(customer);
      }
    }
  );
});

//create subscription
router.post('/subscribe', (req, res) => {
  const { customer, plan } = req.body;

  stripe.subscriptions.create(
    {
      customer: customer,
      items: [{ plan: plan }],
    },
    function(err, subscription) {
      // asynchronously called
      if (err) {
        res.status(402).json(err);
      } else {
        //if successfully subscribed, save stripe customer id to our db on 'users' table
        // Billing.saveStripeId(this.props.id, customer);

        res.status(200).json(subscription);
      }
    }
  );
});

module.exports = router;
