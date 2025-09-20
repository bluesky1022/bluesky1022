let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const Admin = require('./../models/Admin');
let secretOrKey = require('./key').secretOrKey;
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;
module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        Admin.findOne({id: jwt_payload.id})
        .then((admin) => {
            if (admin) {
                return done(null, admin);
            } else {
                return done(null, false);
            }
        });
    }));
}