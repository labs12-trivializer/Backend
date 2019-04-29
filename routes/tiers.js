const router = require('express').Router();

const Tiers = require('../models/tiers');

router.get('/', async (req, res) => {
  const tiers = await Tiers.get();
  if (tiers.length > 0) {
    res.status(200).json(tiers);
  } else {
    res.status(400).json({ message: 'No tiers exist' });
  }
});
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const tier = await Tiers.getById(id);
  if (tier.length > 0) {
    res.status(200).json(tier);
  } else {
    res.status(400).json({ message: 'Tier does not exist' });
  }
});

module.exports = router;
