var ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {};
//opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
opts.secretOrKey = 'humanResourceMgmtAuthentication';

module.exports = {
  opts
}
