const jwt = require('jsonwebtoken');

const genereteJWT = (payload) => {
  let token = null;
  token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  console.log({ token });

  return token;
};

module.exports = genereteJWT;
