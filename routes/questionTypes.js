const router = require('express').Router();

const QuestionTypes = require('../models/questionTypes');

// get all questionTypes
router.get('/', async (req, res) => {
  const questionTypes = await QuestionTypes.find();

  return res.status(200).json(questionTypes);
});

router.get('/normalized', async (req, res) => {
  const questionTypes = await QuestionTypes.find();

  const normalized = {
    result: questionTypes.map(c => c.id),
    entities: {
      questionTypes: questionTypes.reduce((accu, cur) => {
        accu[cur.id] = cur;
        return accu;
      }, {})
    }
  };

  normalized.result.length
    ? res.status(200).json(normalized)
    : res
        .status(404)
        .json({ message: 'There are no questionTypes for that question.' });
});

module.exports = router;
