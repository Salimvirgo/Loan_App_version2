const LocalStrategy = require("passport-local").Strategy;
const { dbObject } = require("../db/db");
const bcrypt = require("bcryptjs");

function InitializePassport(passport) {
  try {
    passport.use(
      new LocalStrategy(
        { usernameField: "username", passwordField: "password" },
        async (username, password, done) => {
          const user = await dbObject.GetUserByUsername(username.trim());
          if (user.length > 0) {
            //check the users password
            const ourUser = user[0];
            const isMatch = await bcrypt.compare(password, ourUser.password);
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Invalid Login Credentials",
              });
            }
          } else {
            return done(null, false, {
              message: "Not a registered username or email",
            });
          }
        }
      )
    );

    passport.serializeUser((ourUser, done) => {
      done(null, ourUser[0].userId);
    });

    passport.deserializeUser(async (id, done) => {
      const users = await dbObject.GetUserById(id);
      const user = users[0];
      done(null, user);
    });
  } catch (error) {
    throw error;
  }
}
module.exports = InitializePassport;
