const router = require('express').Router();

const Questions = require('../models/questions');

// GET --> /api/questions
router.get('/', async (req, res) => {
  const questions = await Questions.get();
  questions.length > 0
    ? res.status(200).json(questions)
    : (
      console.log(res)
      res.status(400).json({ message: 'No questions found.' });
    )
})

// GET --> /api/questions/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const question = await Questions.getById(id);
  question.length > 0
    ? res.status(200).json(question)
    : (
      console.log(res)
      res.status(400).json({ message: 'Question could not be found.' });
    )
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
  const deleted = await Questions.delete(id);
  deleted
    ? (
      console.log('Deleted: ', deleted);
      res.status(200).json(deleted)
    )
    : res.status(404).json({ message: 'Error: Question not found' });
});