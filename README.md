# Prerequis

- Gitlab >= 7.7
- node.js >= 0.4.0

# Installation dans le client

    npm install passport-sirap

# Usage

```
var SirapStrategy = require('passport-sirap').Strategy;

passport.use(new SirapStrategy({
    clientID: SIRAP_APP_KEY,
    clientSecret: SIRAP_APP_SECRET,
    sirapURL : SWAP_AUTH_SERVER_URL,
    callbackURL: "http://127.0.0.1:3000/auth/sirap/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({ id: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```
