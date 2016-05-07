var express = require('express'), mongoose = require('mongoose'), bodyParser = require('body-parser');

//authintication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var authenticate = require('./authenticate');
var config = require('./config');

var db;
console.log('Hello');
db = mongoose.connect(config.mongoUrl);
var Customer = require('./models/customerModel');

var app = express();

var port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// passport config
var User = require('./models/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var customerRouter = require('./Routes/customerRoutes')(Customer);
var users = require('./Routes/users');
app.use('/api/customers', customerRouter);
app.use('/api/users', users);

app.use(express.static('public'));
app.use(express.static('src/views'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});
module.exports = app;