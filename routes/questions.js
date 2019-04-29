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
  const currentUserId = req.user.sub;

  const { body: user } = req;

  user.auth0_id = currentUserId;


  const validationResult = Users.validate(req.body);
  if (validationResult.error) {
    return res.status(422).json(validationResult);
  }

  const updatedUser = await Users.update(currentUserId, user);
  return res.status(200).json(updatedUser);
});