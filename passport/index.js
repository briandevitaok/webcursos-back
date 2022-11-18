const passport = require('passport');
const { deleteOne } = require('.././models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('.././models/user');
const JwtStrategy = require('passport-jwt').Strategy;

const jwtExtractor = function (req) {
  let token = null;
  if (req && req.headers['authorization']) {
    token = req.headers['authorization'].split(' ')[1];
  }
  console.log({token})
  return token;
};

passport.use(
  new JwtStrategy(
    { jwtFromRequest: jwtExtractor, secretOrKey: process.env.JWT_SECRET_KEY },
    async function (jwt_payload, done) {
      try {
        const foundUser = await User.findOne({ _id: jwt_payload.sub});
        done(null, foundUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const foundUser = await User.findOne({ googleId: profile.id });

        console.log({ foundUser });

        if (!!foundUser) {
          return cb(null, foundUser);
        } else {
          const createUser = await User.create({
            googleId: profile.id,
            firstname: profile._json.given_name,
            lastname: profile._json.family_name,
            email: profile._json.email,
            pictureUrl: profile._json.picture,
          });
          return cb(null, createUser);
        }
      } catch (err) {
        console.log({ err });
        deleteOne(err, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const foundUser = await User.findById(id);
    done(null, foundUser);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
