const { logger, errorLogger } = require('../middleware/winston');
const restricted = require('../middleware/restricted');
const tiers = require('./tiers');
// const auth = require('./auth');
const users = require('./users');
const questionTypes = require('./questionTypes');
const questions = require('./questions');
// const answers = require('./answers');
const categories = require('./categories');
const games = require('./games');
const rounds = require('./rounds');
const billing = require('./billing');
const answers = require('./answers');
const contact = require('./contact');
const lookupUser = require('../middleware/lookupUser');

module.exports = server => {
  server.use(logger);

  server.get('/authorized', restricted, function(req, res) {
    res.send('Secured Resource');
  });

  // server.use('/api/auth', auth);
  server.use('/api/users', restricted, users);
  server.use('/api/games', restricted, lookupUser, games);
  server.use('/api/rounds', restricted, lookupUser, rounds);
  server.use('/api/questions', restricted, lookupUser, questions);
  // server.use('/api/answers', answers);
  server.use('/api/billing', restricted, lookupUser, billing);
  server.use('/api/answers', restricted, lookupUser, answers);
  server.use('/api/question_types', restricted, questionTypes);
  server.use('/api/categories', restricted, categories);
  server.use('/api/tiers', restricted, tiers);
  server.use('/api/contact', contact);
  server.get(/\/(?:api)?/, (req, res) => {
    res.status(200).json({ message: 'Server up & running!' });
  });

  server.use(errorLogger);
};
