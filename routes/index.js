const { logger, errorLogger } = require('../middleware/winston');

module.exports = server => {
  server.use(logger);

  // server.use('/api/auth', auth);
  // server.use('/api/users', users);
  // server.use('/api/games', games);
  // server.use('/api/rounds', rounds);
  // server.use('/api/questions', questions);
  // server.use('/api/answers', answers);
  server.get(/\/(?:api)?/, (req, res) => {
    res.status(200).json({ message: 'Server up & running!' });
  });

  server.use(errorLogger);
};
