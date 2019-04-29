const router = require('express').Router();

const jwtCheck = require('../middleware/jwtCheck');
const Games = require('../models/games');

// require valid token
router.use(jwtCheck);

// get all games
router.get('/', async (req, res) => {
  const currentUserId = req.user.sub;
  const games = await Games.find()
    .select('games.*')
    .leftJoin('users', 'users.id', '=', 'games.user_id')
    .where('users.auth0_id', currentUserId);

  return res.status(200).json(games);
});

module.exports = router;
