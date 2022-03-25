const passport = require('passport');
const bcrypt = require('bcrypt');
const { ensureAuthenticated } = require('./auth/ensureAuthenticated');
const { genAuthToken, genRefreshToken } = require('./jwts/gentoken');
const jwt = require('jsonwebtoken'); 

// Cookie options 
const COOKIE_OPTS = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000
}

module.exports = (app, User) => {
    // Home
    app.get('/none', (req, res) => {
        res.send({authToken: ""});
    })

    // Profile 
    app.post('/profile', passport.authenticate('jwt', { session: false }),
        (req, res) => {
            res.json({user: req.user});
        }
    );

    // Register
    app.post('/register', (req, res) => {
        const {
            firstName,
            lastName,
            registerEmail,
            registerUsername,
            registerPassword
        } = req.body;
        User
            .findOne({ email: registerEmail })
            .then(user => {
                if (user) {
                    throw new Error("This email is already registered with another account"); 
                }
                else {
                    let saltRounds = 10;
                    bcrypt.genSalt(saltRounds, (err, salt) => {
                        bcrypt.hash(registerPassword, salt, (err, hash) => {
                            let user = new User({
                                firstName,
                                lastName,
                                email: registerEmail,
                                password: hash,
                                username: registerUsername
                            }); 
                            user.save((err, doc) => {
                                if (err) {
                                    throw new Error("An error has occurred")
                                }
                                else {
                                    res.json({
                                        message: "New user is successfully registered. You can close this form and log in"
                                    });
                                }
                            });
                        });
                    });
                }

            })
            .catch(err => console.log(err))
    });

    // Auth token
    app.post('/refreshToken', (req, res) => {
        const refreshToken = req.cookies["refreshToken"];
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const { _id } = payload;
            User
                .findOne({ _id })
                .then(user => {
                    console.log(user);
                    if (user) {
                        const refreshTokenMatch = (user.refreshtoken === refreshToken);
                        if (refreshTokenMatch) {
                            const authToken = genAuthToken({ _id: user._id});
                            const newRefreshToken = genRefreshToken({ _id: user._id });
                            user.refreshtoken = newRefreshToken;
                            user.save((err, doc) => {
                                if (err) {
                                    throw new Error(err); 
                                } else {
                                    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTS);
                                    console.log(authToken);
                                    res.json({ authToken }); 
                                }

                            })
                        }
                    }
                })
                .catch(err => {throw new Error(err)});
        }
        catch (err) {
            throw new Error(err); 
        }
    })

    // Login 
    app.post('/login', passport.authenticate('local', {failureRedirect: '/none'}),
        (req, res, next) => {
            console.log(req.user);
            const { _id } = req.user;
            const authToken = genAuthToken({ _id }); 
            const refreshToken = genRefreshToken({ _id }); 
            User
                .findOne({ _id })
                .then(user => {
                    user.refreshtoken = refreshToken;
                    user.save((err, user) => {
                        if (err) {
                            throw new Error(err); 
                        } else {
                            res.cookie("refreshToken", refreshToken, COOKIE_OPTS);
                            res.json({authToken})
                        }
                    })
                })
                .catch(err => { throw new Error(err)});
    });

    // Logout 
    app.post('/logout', (req, res) => {
        res.clearCookie("connect.sid")
        res.clearCookie("refreshToken");
        res.json({ authToken: "" });
    })
}
