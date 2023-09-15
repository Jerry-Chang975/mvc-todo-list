const passport = require('passport');
const bcrypt = require('bcryptjs');
const axios = require('axios');

passport.deserializeUser((user, done) => {
  done(null, { id: user.id });
});

const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook');

const db = require('../models');
const User = db.User;

// local strategy
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
    return User.findOne({
      attributes: ['id', 'email', 'password'],
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: 'Incorrect username or password.',
          });
        }
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (!isMatch) {
            return done(null, false, {
              message: 'Incorrect username or password.',
            });
          }
          return done(null, user);
        });
      })
      .catch((error) => {
        error.errorMessage = 'login failed';
        done(error);
      });
  })
);

// Facebook OAuth2
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['email', 'displayName'],
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      // 再藉由accessToken取得user data
    //   axios
    //     .get(
    //       'https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=' +
    //         accessToken
    //     )
    //     .then((response) => {
    //       console.log('FB');
    //       console.log(response.data);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });

      return User.findOne({
        attributes: ['id', 'name', 'email'],
        where: { email },
        raw: true,
      }).then((user) => {
        if (user) {
          return done(null, user);
        }
        const randomPwd = Math.random().toString(36).slice(-8);
        return bcrypt
          .hash(randomPwd, 10)
          .then((hash) => User.create({ name, email, password: hash }))
          .then((user) =>
            done(null, { id: user.id, name: user.name, email: user.email })
          )
          .catch((err) => {
            err.errorMessage = 'login failed';
            done(err);
          });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email });
});
