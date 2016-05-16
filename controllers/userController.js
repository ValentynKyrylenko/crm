var UserController = function (User) {
    var post = function (req, res) {
        //req.body.postedBy = req.decoded._doc._id;
        var user = new User(req.body);
        if (!req.body.currentWeek) {
            res.status(400);
            res.send('Week number and number of weak are required');
        }
        else {
            User.save();
            res.status(201);
            res.send(User);
        }
    };
    var get = function (req, res) {
        var query = {};
        if (req.query.weekNumber) {
            query.weekNumber = req.query.weekNumber;
        }
        User.find(query).populate('postedBy')
            .exec(function (err, Users) {
                if (err)
                    res.status(500).send(err);
                else {
                    var returnUsers = [];
                    Users.forEach(function (element, index, array) {
                        var newUser = element.toJSON();
                        newUser.links = {};
                        newUser.links.self = 'http://' + req.headers.host + '/api/Users/' + newUser._id;
                        returnUsers.push(newUser);
                    });
                    res.json(returnUsers);
                }
            });
    };
    return {
        post: post,
        get: get
    };
};
module.exports = UserController;