const router = require('express').Router();

const Categories = require('../models/categories');

// get all categories
router.get('/', async (req, res) => {
  const categories = await Categories.find();

  return res.status(200).json(categories);
});

router.get('/normalized', async (req, res) => {
  const categories = await Categories.find();

  const normalized = {
    result: categories.map(c => c.id),
    entities: {
      categories: categories.reduce((accu, cur) => {
        accu[cur.id] = cur;
        return accu;
      }, {})
    }
  };

  normalized.result.length
    ? res.status(200).json(normalized)
    : res
        .status(404)
        .json({ message: 'There are no categories for that question.' });
});

module.exports = router;
