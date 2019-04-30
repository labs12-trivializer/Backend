const { logger, errorLogger } = require('../middleware/winston');
const jwtCheck = require('../middleware/jwtCheck');
const tiers = require('./tiers');
const users = require('./users');
const questionTypes = require('./questionTypes');
const categories = require('./categories');
const games = require('./games');
const rounds = require('./rounds');
const lookupUser = require('../middleware/lookupUser');

module.exports = server => {
  server.use(logger);

  server.get('/authorized', jwtCheck, function (req, res) {
      res.send('Secured Resource');
  });
  // server.use('/api/auth', auth);
  server.use('/api/users', jwtCheck, users);
  server.use('/api/games', jwtCheck, lookupUser, games);
  server.use('/api/rounds', jwtCheck, lookupUser, rounds);
  // server.use('/api/questions', questions);
  // server.use('/api/answers', answers);
  server.use('/api/question_types', jwtCheck, questionTypes);
  server.use('/api/categories', jwtCheck, categories);
  server.use('/api/tiers', jwtCheck, tiers);
  server.get(/\/(?:api)?/, (req, res) => {
    res.status(200).json({ message: 'Server up & running!' });
  });

  server.use(errorLogger);
};
