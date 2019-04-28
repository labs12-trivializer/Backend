const router = require('express').Router();

const jwtCheck = require('../middleware/jwtCheck');
const QuestionTypes = require('../models/questionTypes');

// require valid token
router.use(jwtCheck);

// get all questionTypes
router.get('/', async (req, res) => {
  const questionTypes = await QuestionTypes.find();

  return res.status(200).json(questionTypes);
});

module.exports = router;
