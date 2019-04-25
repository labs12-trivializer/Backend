const { logger, errorLogger } = require('../middleware/winston');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://dev-d9y68pfa.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://lambda-trivializer.herokuapp.com/',
    issuer: 'https://dev-d9y68pfa.auth0.com/',
    algorithms: ['RS256']
});

module.exports = server => {
  server.use(logger);

  server.get('/authorized', jwtCheck, function (req, res) {
      res.send('Secured Resource');
  });
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
