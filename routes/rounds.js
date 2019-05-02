const router = require('express').Router();

//Rounds model
const Rounds = require('../models/rounds');

//returns all rounds ('/api/rounds')
router.get('/', async (req, res) => {
  const userId = req.user.dbInfo.id;
  const rounds = await Rounds.find().modify(Rounds.withUserId, userId);
  if (rounds) {
    res.status(200).json(rounds);
  } else {
    res.status(500).json({ error: 'error in retrieving round' });
  }
});

// get all user games
router.get('/normalized', async (req, res) => {
  const user_id = req.user.dbInfo.id;
  const rounds = await Rounds.find().modify(Rounds.withUserId, user_id);

  const normalized = {
    result: rounds.map(r => r.id),
    entities: {
      rounds: rounds.reduce((accu, cur) => {
        accu[cur.id] = cur;
        return accu;
      }, {})
    }
  };

  return res.status(200).json(normalized);
});

//get round by id ('/api/rounds/:id')
router.get('/normalized/:id', async (req, res) => {
  const userId = req.user.dbInfo.id;
  const { id } = req.params;
  const result = await Rounds.findByIdNormalized(id, userId);

  if (!result) {
    return res.status(404).json({
      error: {
        name: 'ValidationError',
        details: [{ message: 'No round with that id found for this user' }]
      }
    });
  }

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ error: 'error in retrieving round' });
  }
});

//get round by id ('/api/rounds/:id')
router.get('/:id', async (req, res) => {
  const userId = req.user.dbInfo.id;
  const { id } = req.params;
  const round = await Rounds.find()
    .modify(Rounds.withUserId, userId)
    .where('rounds.id', id)
    .first();

  if (!round) {
    return res.status(404).json({
      error: {
        name: 'ValidationError',
        details: [{ message: 'No round with that id found for this user' }]
      }
    });
  }

  if (round) {
    res.status(200).json(round);
  } else {
    res.status(500).json({ error: 'error in retrieving round' });
  }
});

//add a new round ('/api/rounds')
router.post('/', async (req, res) => {
  const roundToAdd = req.body;
  const added = await Rounds.insert(roundToAdd);
  if (added) {
    res.status(200).json(added);
  } else {
    res.status(500).json({ error: 'error in adding round' });
  }
});

//edit an existing round ('/api/rounds/:id')
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.dbInfo.id;
  const round = await Rounds.find()
    .modify(Rounds.withUserId, userId)
    .where('rounds.id', id)
    .first();

  if (!round) {
    return res.status(404).json({
      error: {
        name: 'ValidationError',
        details: [{ message: 'No round with that id found for this user' }]
      }
    });
  }

  const changes = req.body;
  const updated = await Rounds.update(id, changes);
  if (updated) {
    res.status(200).json(updated);
  } else {
    res.status(500).json({ error: 'error in editing round' });
  }
});

//delete an existing round ('/api/rounds/:id')
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.dbInfo.id;
  const round = await Rounds.find()
    .modify(Rounds.withUserId, userId)
    .where('rounds.id', id)
    .first();

  if (!round) {
    return res.status(404).json({
      error: {
        name: 'ValidationError',
        details: [{ message: 'No round with that id found for this user' }]
      }
    });
  }

  const deleted = await Rounds.deleteItem(id);
  if (deleted) {
    res.status(200).json({ message: 'item deleted' });
  } else {
    res.status(404).json({ message: 'round does not exist, cannot delete' });
  }
});

module.exports = router;
