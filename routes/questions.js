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