const router = require('express').Router();

const Categories = require('../models/categories');

// get all categories
router.get('/', async (req, res) => {
  const categories = await Categories.find();

  return res.status(200).json(categories);
});

module.exports = router;
