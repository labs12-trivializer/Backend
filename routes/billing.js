const router = require('express').Router();
// Set your secret key: remember to change this to your live secret key in production
const key = process.env.SECRET_STRIPE_KEY;
const stripe = require('stripe')(key);

router.post('/customer', (req, res) => {
  //customer object from frontend
  const { name, email, description } = req.body;
  //create customer with details sent from frontend
  stripe.customers.create(
    {
      name,
      email,
      description,
      source: 'tok_amex', //amex token hardcoded while testing
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
        res.status(200).json(subscription);
      }
    }
  );
});

module.exports = router;
