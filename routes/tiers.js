const router = require('express').Router();

const Tiers = require('../models/tiers');

router.get('/', async (req, res) => {
  try {
    const tiers = await Tiers.get();
    if (tiers.length > 0) {
      res.status(200).json(tiers);
    } else {
      res.status(400).json({ message: 'No tiers exist' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tier = await Tiers.getById(id);
    if (tier.length > 0) {
      res.status(200).json(tier);
    } else {
      res.status(400).json({ message: 'Tier does not exist' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
