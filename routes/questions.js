const router = require('express').Router();

const Questions = require('../models/questions');

// GET --> /api/questions
// router.get('/', async (req, res) => {
//   const questions = await Questions.get();
//   questions.length > 0
//     ? res.status(200).json(questions)
//     : res.status(400).json({ message: 'Error: No questions found.' });
// })

// GET questions by user_id
router.get('/', async (req, res) => {
  const user_id = req.user.dbInfo.id;
  // const { id } = req.params;
  const questions = await Questions.findByUserId(user_id);

  if (!questions) {
    return res.status(404).json({
      error: {
        name: 'ValidationError',
        details: [{ message: 'No questions by this user could be found.' }]
      }
    });
  }

  return res.status(200).json(questions);
});

// GET --> /api/questions/:id
router.get('/:id', async (req, res) => {
  console.log('REQ PARAMS: ', req.params);
  const { id } = req.params;
  const question = await Questions.getById(id);
  question.length > 0
    ? res.status(200).json(question)
    : res.status(400).json({ message: 'Error: Question not found.' });
})


// PUT --> /api/questions/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const changes = req.body
  const updated = await Questions.update(id, changes);
  updated
    ? res.status(200).json(updated)
    : res.status(500).json({ message: 'Error: Could not update question' });
});

// POST --> /api/questions
router.post('/', async (req, res) => {
  const newQuestion = req.body;
  const inserted = await Questions.insert(newQuestion);
  inserted 
    ? res.status(200).json(inserted)
    : res.status(500).json({ message: 'Error: Could not add question' });
});

// DELETE --> /api/questions/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Questions.find()
    .where({ id })
    .first();
  await Questions.deleteQuestion(id);
  return deleted
    ? res.status(200).json({
      deleted,
      message: 'Question deleted'
    })
    : res.status(404).json({ message: 'Error: Question not found' });
});

module.exports = router;