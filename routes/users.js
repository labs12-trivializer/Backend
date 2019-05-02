const router = require('express').Router();
const validate = require('../middleware/validate');
const Users = require('../models/users');

// user profile route
router.get('/my_profile', async (req, res) => {
  const currentUserId = req.user.sub;

  const user = await Users.getByAuth0Id(currentUserId);

  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({ message: 'User does not exist' });
  }
});

// update user profile
router.put('/my_profile', validate(Users.schema), async(req, res) => {
  const currentUserId = req.user.sub;

  const { body: user } = req;

  user.auth0_id = currentUserId;

  const updatedUser = await Users.update(currentUserId, user);
  return res.status(200).json(updatedUser);
});

// get user profile by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.sub;

  const user = await Users.getById(id);

  if (user) {
    // make sure the currentUserId matches auth0_id for the user we're requesting
    if (user.auth0_id !== currentUserId) {
      return res.status(422).json({
        error: {
          name: 'ValidationError',
          details: [{ message: "auth0_id does not match token's auth0 id" }]
        }
      });
    }

    return res.status(200).json(user);
  } else {
    return res.status(404).json({ message: 'User does not exist' });
  }
});

// this post request should come in on all successful auth0 signins
router.post('/', validate(Users.schema, true), async (req, res) => {
  const { body: user } = req;

  // this gets attached via the jwtCheck middleware from line 18 (used on all user routes)
  const currentUserId = req.user.sub;

  // if the user existed, return that
  const foundUser = await Users.find()
    .where({ auth0_id: currentUserId })
    .first();

  if (foundUser) {
    return res.status(200).json(foundUser);
  }

  // add new user auth0 id
  user.auth0_id = currentUserId;

  // otherwise make a new one and return it
  const newUser = await Users.insert(user);
  return res.status(201).json(newUser);
});

module.exports = router;
