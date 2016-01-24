/**
 * Module dependencies.
 */
var util = require('util');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var InternalOAuthError = require('passport-oauth').InternalOAuthError;

function Strategy(options, verify) {
	if (typeof options == 'function') {
		verify = options;
		options = {};
	}

	options.sirapAuthURL = options.sirapAuthURL || 'https://secure.sirap.fr';

  	if (!options.sirapAuthURL) { throw new TypeError('OAuth2Strategy requires a sirapAuthURL option'); }

  	options.authorizationURL = options.sirapAuthURL + '/oauth2/authorize';
  	options.tokenURL = options.sirapAuthURL + '/api/v1/oauth2/token';

	if (!verify) { throw new TypeError('LocalStrategy requires a verify callback'); }
	if (!options.sirapAuthURL) { throw new TypeError('SirapStrategy requires a sirapAuthURL option'); }

	OAuth2Strategy.call(this, options, verify);
	this.name = 'sirap';
	this.sirapAuthURL = options.sirapAuthURL ;
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
  var that = this;
  this._oauth2.get(this.sirapAuthURL + '/api/v1/users/me', accessToken.token, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    try {
      var json = JSON.parse(body);
      var profile = { provider: 'sirap' };
      profile.id = json.id;
      profile.displayName = json.displayName;
      profile.emails = [{ value: json.email }];
      profile.username = json.username ;
      profile.avatar = that.sirapAuthURL + '/' + json.profileImageURL;
      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};

module.exports = Strategy;
