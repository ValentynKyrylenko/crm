var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

/* GET users listing. */
router.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        var query = {};
        if (req.query.manager) {
            query.manager = req.query.manager;
        }
        else if (req.query.admin) {
            query.admin = req.query.admin;
        };
        User.find(query, function (err, user) {
            if (err) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            };
            res.json(user);
        });
    });
router.post('/register', function (req, res) {
    User.register(new User({username: req.body.username}),
        req.body.password, function (err, user) {
            if (err) {
                return res.status(500).json({err: err});
            }
            if (req.body.firstname) {
                user.firstname = req.body.firstname;
            }
            if (req.body.lastname) {
                user.lastname = req.body.lastname;
            }
            user.save(function (err, user) {
                passport.authenticate('local')(req, res, function () {
                    return res.status(200).json({status: 'Registration Successful!'});
                });
            });
        });
});


router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            //var token = Verify.getToken(user);
            var token = Verify.getToken({"username":user.username, "_id":user.id, "admin":user.admin});
            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

router.get('/facebook', passport.authenticate('facebook'),
    function (req, res) {
    });

router.get('/facebook/callback', function (req, res, next) {
    passport.authenticate('facebook', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            var token = Verify.getToken(user);
            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });

    })(req, res, next);
});

router.use('/:UserId', function (req, res, next) {
    User.findById(req.params.UserId)
        .exec(function (err, User) {
            if (err)
                res.status(500).send(err);
            else if (User) {
                req.User = User;
                next();
            }
            else {
                res.status(404).send('no User found');
            }
        });
});

router.route('/:UserId')
    .get(function (req, res) {

        var returnUser = req.User.toJSON();

        returnUser.links = {};
        var newLink_1 = 'http://' + req.headers.host + '/api/users/?manager=' + returnUser.manager;
        returnUser.links.FilterByManager = newLink_1.replace(' ', '%20');
        res.json(returnUser);

    })
    .put(function (req, res) {
        req.User.username = req.body.username;
        req.User.firstname = req.body.firstname;
        req.User.lastname = req.body.lastname;
        req.User.admin = req.body.admin;
        req.User.manager = req.body.manager;
        req.User.save(function (err) {
            if (err)
                res.status(500).send(err);
            else {
                res.json(req.User);
            }
        });
    })
    .patch(function (req, res) {
        if (req.body._id)
            delete req.body._id;

        for (var p in req.body) {
            req.User[p] = req.body[p];
        }

        req.User.save(function (err) {
            if (err)
                res.status(500).send(err);
            else {
                res.json(req.User);
            }
        });
    })
    .delete(function (req, res) {
        req.User.remove(function (err) {
            if (err)
                res.status(500).send(err);
            else {
                res.status(204).send('Removed');
            }
        });
    });

module.exports = router;