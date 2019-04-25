const router = require('express').Router();
const db = require('../data/db');

router.get('/', async (req, res) => {
  try {
    const tiers = await db('tiers');
    res.status(200).json(tiers);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
