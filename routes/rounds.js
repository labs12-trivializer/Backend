const router = require('express').Router();

//Rounds model
const Rounds = require('../models/rounds');

//returns all rounds ('/api/rounds')
router.get('/', async (req, res) => {
  const rounds = await Rounds.get();
  if (rounds) {
    res.status(200).json(rounds);
  } else {
    res.status(500).json({ error: 'error in retrieving round' });
  }
});

//get round by id ('/api/rounds/:id')
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const round = await Rounds.getById(id);
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
  const changes = req.body;
  const updated = await Rounds.update(id, changes);
  console.log(updated);
  if (updated) {
    res.status(200).json(updated);
  } else {
    res.status(500).json({ error: 'error in editing round' });
  }
});

//delete an existing round ('/api/rounds/:id')
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Rounds.deleteItem(id);
  console.log(deleted);
  if (deleted) {
    res.status(200).json({ message: 'item deleted' });
  } else {
    res.status(404).json({ message: 'round does not exist, cannot delete' });
  }
});

module.exports = router;
