const router = require('express').Router();

const Questions = require('../models/questions');
const Rounds = require('../models/rounds');

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

// get all user questions normalized
router.get('/normalized', async (req, res) => {
  const user_id = req.user.dbInfo.id;
  const questions = await Questions.find().modify(
    Questions.withUserId,
    user_id
  );

  const normalized = {
    result: questions.map(q => q.id),
    entities: {
      questions: questions.reduce((accu, cur) => {
        accu[cur.id] = cur;
        return accu;
      }, {})
    }
  };

  return res.status(200).json(normalized);
});

// GET --> /api/questions/:id
router.get('/normalized/:id', async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.dbInfo.id;
  const result = await Questions.findByIdNormalized(id, user_id);
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json({ message: 'Error: Question not found.' });
  }
});

// GET --> /api/questions/:id
router.get('/:id', async (req, res) => {
  console.log('REQ PARAMS: ', req.params);
  const { id } = req.params;
  const question = await Questions.getById(id);
  question.length > 0
    ? res.status(200).json(question)
    : res.status(400).json({ message: 'Error: Question not found.' });
});

// PUT --> /api/questions/normalized/:id
// expects nested data, responds with normalized response
router.put('/nested/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.dbInfo.id;
  const question = await Questions.find()
    .modify(Questions.withUserId, userId)
    .where('questions.id', id)
    .first();

  if (!question) {
    return res.status(404).json({
      error: {
        name: 'ValidationError',
        details: [{ message: 'No question with that id found for this user' }]
      }
    });
  }
  const changes = req.body;
  const dbQuestion = await Questions.nestedUpdate(id, changes).then(id =>
    Questions.findByIdNormalized(id, userId)
  );
  res.status(200).json(dbQuestion);
});

// PUT --> /api/questions/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
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

// POST --> /api/questions/nested
router.post('/nested', async (req, res) => {
  const newQuestion = req.body;
  const userId = req.user.dbInfo.id;
  const dbRound = await Rounds.find()
    .where({ 'rounds.id': newQuestion.round_id })
    .modify(Rounds.withUserId, userId)
    .first();

  if (!dbRound) {
    return res.status(404).json({
      error: {
        name: 'ValidationError',
        details: [
          { message: 'No round found for this user with that round_id' }
        ]
      }
    });
  }

  const createdQuestion = await Questions.nestedInsert(newQuestion).then(id =>
    Questions.findByIdNormalized(id, userId)
  );
  res.status(200).json(createdQuestion);
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
