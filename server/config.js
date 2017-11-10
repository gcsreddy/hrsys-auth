var ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {};
//opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'humanResourceMgmtAuthentication';

module.exports = {
  opts
}
