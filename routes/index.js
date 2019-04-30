const { logger, errorLogger } = require('../middleware/winston');
const jwtCheck = require('../middleware/jwtCheck');
const tiers = require('./tiers');
const users = require('./users');
const questionTypes = require('./questionTypes');
const categories = require('./categories');
const rounds = require('./rounds');

module.exports = server => {
  server.use(logger);

  server.get('/authorized', jwtCheck, function(req, res) {
    res.send('Secured Resource');
  });
  // server.use('/api/auth', auth);
  server.use('/api/users', users);
  // server.use('/api/games', games);
  server.use('/api/rounds', rounds);
  // server.use('/api/questions', questions);
  // server.use('/api/answers', answers);
  server.use('/api/question_types', questionTypes);
  server.use('/api/categories', categories);
  server.use('/api/tiers', tiers);
  server.get(/\/(?:api)?/, (req, res) => {
    res.status(200).json({ message: 'Server up & running!' });
  });

  server.use(errorLogger);
};
