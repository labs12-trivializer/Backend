const router = require('express').Router();

const jwtCheck = require('../middleware/jwtCheck');
const Users = require('../models/users');

// require valid token
router.use(jwtCheck);

// user profile route
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await Users.getById(id);
  if (user.length > 0) {
    res.status(200).json(user);
  } else {
    res.status(400).json({ message: 'User does not exist' });
  }
});

// this post request should come in on all successful auth0 signins
router.post('/', async (req, res) => {
  const { body: user } = req;

  // validate input with Joi schema in from users model file.
  const validationResult = Users.validate(req.body);
  if(validationResult.error) {
    return res.status(422).json(validationResult);
  }


  const foundUser = await Users.find().where({ email: user.email }).first();
  if(foundUser) {
    return res.status(200).json(foundUser);
  }

  const newUser = await Users.insert(user);
  return res.status(201).json(newUser);
});

module.exports = router;
