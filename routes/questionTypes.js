const router = require('express').Router();

const QuestionTypes = require('../models/questionTypes');

// get all questionTypes
router.get('/', async (req, res) => {
  const questionTypes = await QuestionTypes.find();

  return res.status(200).json(questionTypes);
});

module.exports = router;
