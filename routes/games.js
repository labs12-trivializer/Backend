const router = require('express').Router();

const Games = require('../models/games');

// get all user games
router.get('/', async (req, res) => {
  const user_id = req.user.dbInfo.id;
  const games = await Games.find().where({ user_id });

  return res.status(200).json(games);
});

// get all user games
router.get('/normalized', async (req, res) => {
  const user_id = req.user.dbInfo.id;
  const games = await Games.findWithCounts().where('games.user_id', user_id);

  const normalized = {
    result: games.map(g => g.id),
    entities: {
      games: games.reduce((accu, cur) => {
        accu[cur.id] = cur;
        return accu;
      }, {})
    }
  };

  return res.status(200).json(normalized);
});

// read game, normalized response
router.get('/normalized/:id', async (req, res) => {
  const user_id = req.user.dbInfo.id;
  const { id } = req.params;
  const result = await Games.findByIdAndUserIdNormalized(id, user_id);

  if (!result) {
    return res.status(404).json({
      error: {
        name: 'ValidationError',
        details: [{ message: 'No game with that id found for this user' }]
      }
    });
  }

  return res.status(200).json(result);
});

// read game
router.get('/:id', async (req, res) => {
  const user_id = req.user.dbInfo.id;
  const { id } = req.params;
  const game = await Games.findByIdAndUserId(id, user_id);

  if (!game) {
    return res.status(404).json({
      error: {
        name: 'ValidationError',
        details: [{ message: 'No game with that id found for this user' }]
      }
    });
  }

  return res.status(200).json(game);
});

router.put('/nested/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.dbInfo.id;
  const game = await Games.find()
    .where({ id, user_id: userId })
    .first();

  if (!game) {
    return res.status(404).json({
      error: {
        name: 'ValidationError',
        details: [{ message: 'No game with that id found for this user' }]
      }
    });
  }

  const nestedGame = req.body;
  const dbGame = await Games.nestedUpdate(id, nestedGame).then(id =>
    Games.findByIdAndUserIdNormalized(id, userId)
  );
  res.status(200).json(dbGame);
});

// update game
router.put('/:id', async (req, res) => {
  const currentUserId = req.user.sub;
  const { body: editedGame } = req;

  const validationResult = Games.validate(editedGame);
  if (validationResult.error) {
    return res.status(422).json(validationResult);
  }

  editedGame.user_id = req.user.dbInfo.id;

  const game = await Games.find()
    .select('games.*')
    .leftJoin('users', 'users.id', '=', 'games.user_id')
    .where('users.auth0_id', currentUserId)
    .where('games.id', req.params.id)
    .first();

  if (!game) {
    return res.status(404).json({
      error: {
        name: 'ValidationError',
        details: [{ message: 'No game with that id found for this user' }]
      }
    });
  }

  const updatedGame = await Games.update(game.id, editedGame);
  return res.status(200).json(updatedGame);
});

// create game
router.post('/', async (req, res) => {
  const { body: newGame } = req;

  const validationResult = Games.validate(newGame);
  if (validationResult.error) {
    return res.status(422).json(validationResult);
  }

  newGame.user_id = req.user.dbInfo.id;

  const createdGame = await Games.insert(newGame);
  return res.status(200).json(createdGame);
});

// create game, handle nested input
router.post('/nested', async (req, res) => {
  const { body: newGame } = req;
  const userId = req.user.dbInfo.id;
  const tierCheck = await Games.validateTier(userId);
  //if game limit has been met, return without creating new game in db
  if (tierCheck.status === 406) {
    return res
      .status(406)
      .json({ error: 'game limit met' })
      .end();
  }
  newGame.user_id = req.user.dbInfo.id;
  const newGameId = await Games.nestedInsert(newGame);
  const createdGame = await Games.findByIdAndUserIdNormalized(
    newGameId,
    newGame.user_id
  );

  return res.status(200).json(createdGame);
});

// destroy game
router.delete('/:id', async (req, res) => {
  const user_id = req.user.dbInfo.id;
  const game = await Games.find()
    .where({ user_id })
    .where('games.id', req.params.id)
    .first();

  if (!game) {
    return res.status(404).json({
      error: {
        name: 'ValidationError',
        details: [{ message: 'No game with that id found for this user' }]
      }
    });
  }

  await Games.remove(game.id);
  return res.status(200).json(game);
});

module.exports = router;
