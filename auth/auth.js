const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const { User } = require('../models/User');
const bcrypt = require('bcrypt');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, doc) => {
            if (err) return console.error(err);
            done(null, doc);
        });
    });

    // Local Strategy 
    passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => {
        User.findOne({ email }, (err, user) => {
                console.log("executed....")
                if (err) { return done(err) };
                if (!user) { return done(null, false) };
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) { throw err };
                    if (result) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false);
                    }
                    
                })
            })
    }))

    // Options for Jwt strategy 
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.JWT_SECRET;

    // Jwt Strategy 
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
}


