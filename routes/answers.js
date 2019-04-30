const router = require('express').Router();
const Questions = require('../models/questions');
const Answers = require('../models/answers');
const restricted = require('../middleware/restricted');
const validate = require('../middleware/validate');

// C - Create
router.post(
  '/',
  restricted,
  validate(Answers.schema, true),
  async ({ body: newAnswer }, res) => {
    // Check that question exists
    const [question] = await Questions.get(newAnswer.question_id);
    if (!question) return res.status(404).json({
      message: 'That question does not exist.'
    });

    // Add the new answer
    const [answerID] = await Answers.add(newAnswer);
    const [answer] = await Answers.get(answerID);

    // Return the new answer
    res.status(201).json(answer);
  }
);

// R - Retrieve (by question id)
router.get('/:id', restricted, async ({ params: { id } }, res) => {
  const answers = await Answers.filter({ question_id: id });
  answers.length
    ? res.status(200).json(answers)
    : res.status(404).json({ message: 'There are no answers for that question.' });
});

// U - Update
router.put(
  '/:id',
  restricted,
  validate(Answers.schema),
  async ({ params: { id }, body: changes }, res) => {
    // Check that question exists
    const [question] = await Questions.get(changes.question_id);
    if (!question) return res.status(404).json({
      message: 'That question does not exist.'
    });

    // Update the new answer and check status
    const updated = await Answers.update(id, changes);
    if (!updated) return res.status(404).json({
      message: 'The answer does not exist.'
    });

    // Return the updated answer
    const [answer] = await Answers.get(id);
    res.status(200).json(answer);
  }
);

// D - Delete
router.delete(
  '/:id',
  restricted,
  async ({ params: { id } }, res) => {
    const deleted = await Answers.remove(id);
    deleted
      ? res.status(200).json({ id: deleted, message: 'Answer deleted.' })
      : res.status(404).json({ message: 'The answer does not exist.' });
  }
);
