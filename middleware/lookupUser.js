const Users = require('../models/users');

module.exports = async (req, res, next) => {
  const user = await Users.getByAuth0Id(req.user.sub);
  req.user.dbInfo = user;

  next();
};
