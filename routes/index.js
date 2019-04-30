const { logger, errorLogger } = require('../middleware/winston');
const restricted = require('../middleware/restricted');
const tiers = require('./tiers');
const users = require('./users');
const questionTypes = require('./questionTypes');
const categories = require('./categories');
const games = require('./games');
const rounds = require('./rounds');
const lookupUser = require('../middleware/lookupUser');

module.exports = server => {
  server.use(logger);

  server.get('/authorized', restricted, function (req, res) {
      res.send('Secured Resource');
  });
  // server.use('/api/auth', auth);
  server.use('/api/users', restricted, users);
  server.use('/api/games', restricted, lookupUser, games);
  server.use('/api/rounds', restricted, lookupUser, rounds);
  // server.use('/api/questions', questions);
  // server.use('/api/answers', answers);
  server.use('/api/question_types', restricted, questionTypes);
  server.use('/api/categories', restricted, categories);
  server.use('/api/tiers', restricted, tiers);
  server.get(/\/(?:api)?/, (req, res) => {
    res.status(200).json({ message: 'Server up & running!' });
  });

  server.use(errorLogger);
};
