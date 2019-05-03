const router = require('express').Router();
const Questions = require('../models/questions');
const Answers = require('../models/answers');
const validate = require('../middleware/validate');

// C - Create
router.post(
  '/',
  validate(Answers.schema, true),
  async ({ body: newAnswer }, res) => {
    // Check that question exists
    const [question] = await Questions.get(newAnswer.question_id);
    if (!question)
      return res.status(404).json({
        message: 'That question does not exist.'
      });

    // Add the new answer
    const [answerID] = await Answers.add(newAnswer);
    const [answer] = await Answers.get(answerID);

    // Return the new answer
    res.status(201).json(answer);
  }
);

// R - Retrieve (by question id) (normalized)
router.get(
  '/normalized/:id',
  async (
    {
      params: { id },
      user: {
        dbInfo: { id: user_id }
      }
    },
    res
  ) => {
    const answers = await Answers.filter({ question_id: id }).modify(
      Answers.withUserId,
      user_id
    );

    const normalized = {
      result: answers.map(a => a.id),
      entities: {
        answers: answers.reduce((accu, cur) => {
          accu[cur.id] = cur;
          return accu;
        }, {})
      }
    };

    normalized.result.length
      ? res.status(200).json(normalized)
      : res
          .status(404)
          .json({ message: 'There are no answers for that question.' });
  }
);

// R - Retrieve (by question id)
router.get('/:id', async ({ params: { id } }, res) => {
  const answers = await Answers.filter({ question_id: id });
  answers.length
    ? res.status(200).json(answers)
    : res
        .status(404)
        .json({ message: 'There are no answers for that question.' });
});

// U - Update
router.put(
  '/:id',
  validate(Answers.schema),
  async ({ params: { id }, body: changes }, res) => {
    // Check that question exists
    const [question] = await Questions.get(changes.question_id);
    if (!question)
      return res.status(404).json({
        message: 'That question does not exist.'
      });

    // Update the new answer and check status
    const updated = await Answers.update(id, changes);
    if (!updated)
      return res.status(404).json({
        message: 'The answer does not exist.'
      });

    // Return the updated answer
    const [answer] = await Answers.get(id);
    res.status(200).json(answer);
  }
);

// D - Delete
router.delete('/:id', async ({ params: { id } }, res) => {
  const deleted = await Answers.remove(id);
  deleted
    ? res.status(200).json({ id: deleted, message: 'Answer deleted.' })
    : res.status(404).json({ message: 'The answer does not exist.' });
});

module.exports = router;
