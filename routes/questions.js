const router = require('express').Router();

const Questions = require('../models/questions');

router.get('/', async (req, res) => {
  const questions = await Questions.get();
  questions.length > 0
    ? res.status(200).json(questions)
    : (
      console.log(res)
      res.status(400).json({ message: 'No questions found.' });
    )
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const question = await Questions.getById();
  question.length > 0
    ? res.status(200).json(question)
    : (
      console.log(res)
      res.status(400).json({ message: 'Question could not be found.' });
    )
})