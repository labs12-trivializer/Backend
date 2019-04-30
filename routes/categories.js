const router = require('express').Router();

const jwtCheck = require('../middleware/restricted');
const Categories = require('../models/categories');

// require valid token
router.use(jwtCheck);

// get all categories
router.get('/', async (req, res) => {
  const categories = await Categories.find();

  return res.status(200).json(categories);
});

module.exports = router;
