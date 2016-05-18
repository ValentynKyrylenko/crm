var express = require('express');
var Verify = require('./verify');
var routes = function (Customer) {
    var CustomerRouter = express.Router();

    var CustomerController = require('../controllers/customerController')(Customer);
    CustomerRouter.route('/')
        .post(Verify.verifyOrdinaryUser, CustomerController.post)
        .get(CustomerController.get);

    CustomerRouter.use('/:CustomerId', function (req, res, next) {
        Customer.findById(req.params.CustomerId)
            .populate('comments.postedBy')
            .exec(function (err, Customer) {
                if (err)
                    res.status(500).next(err);
                else if (Customer) {
                    req.Customer = Customer;
                    next();
                }
                else {
                    res.status(404).send('no Customer found');
                }
            });
    });
    CustomerRouter.route('/:CustomerId')
        .get(function (req, res) {

            var returnCustomer = req.Customer.toJSON();

            returnCustomer.links = {};
            var newLink_1 = 'http://' + req.headers.host + '/api/Customers/?product=' + returnCustomer.product;
            returnCustomer.links.FilterByThisProduct = newLink_1.replace(' ', '%20');
            var newLink_2 = 'http://' + req.headers.host + '/api/Customers/?manager=' + returnCustomer.manager;
            returnCustomer.links.FilterByThisManager = newLink_2.replace(' ', '%20');
            var newLink_3 = 'http://' + req.headers.host + '/api/Customers/?country=' + returnCustomer.country;
            returnCustomer.links.FilterByThisCountry = newLink_3.replace(' ', '%20');
            var newLink_4 = 'http://' + req.headers.host + '/api/Customers/?stage=' + returnCustomer.stage;
            returnCustomer.links.FilterByThisStage = newLink_4.replace(' ', '%20');
            res.json(returnCustomer);

        })
        .put(function (req, res) {
            req.Customer.name = req.body.name;
            req.Customer.surname = req.body.surname;
            req.Customer.companyname = req.body.companyname;
            req.Customer.country = req.body.country;
            req.Customer.email = req.body.email;
            req.Customer.skype = req.body.skype;
            req.Customer.phone = req.body.phone;
            req.Customer.product = req.body.product;
            req.Customer.manager = req.body.manager;
            req.Customer.stage = req.body.stage;
            req.Customer.createdOn = req.body.createdOn;
            req.Customer.modifiedOn = req.body.modifiedOn;
            req.Customer.dueOn = req.body.dueOn;
            req.Customer.documents = req.body.documents;
            req.Customer.notes = req.body.notes;
            req.Customer.save(function (err) {
                if (err)
                    res.status(500).next(err);
                else {
                    res.json(req.Customer);
                }
            });
        })
        .patch(function (req, res) {
            if (req.body._id)
                delete req.body._id;

            for (var p in req.body) {
                req.Customer[p] = req.body[p];
            }

            req.Customer.save(function (err) {
                if (err)
                    res.status(500).next(err);
                else {
                    res.json(req.Customer);
                }
            });
        })
        .delete(function (req, res) {
            req.Customer.remove(function (err) {
                if (err)
                    res.status(500).next(err);
                else {
                    res.status(204).send('Removed');
                }
            });
        });
    //Comments-------------------------------------------------
    CustomerRouter.route('/:CustomerId/comments')
        //.all(Verify.verifyOrdinaryUser)

        .get(function (req, res, next) {
            Customer.findById(req.params.CustomerId)
                .populate('comments.postedBy')
                .exec(function (err, Customer) {
                    if (err) next (err);
                    res.json(Customer.comments);
                });
        })

        .post(Verify.verifyOrdinaryUser, function (req, res, next) {
            Customer.findById(req.params.CustomerId, function (err, Customer) {
                if (err) next (err);
                req.body.postedBy = req.decoded._id;
                //req.body.postedBy = req.decoded._doc._id;
                Customer.comments.push(req.body);
                Customer.save(function (err, Customer) {
                    if (err) next (err);
                    console.log('Updated Comments!');
                    res.json(Customer);
                });
            });
        })

        .delete(Verify.verifyAdmin, function (req, res, next) {
            Customer.findById(req.params.CustomerId, function (err, Customer) {
                if (err) next(err);
                for (var i = (Customer.comments.length - 1); i >= 0; i--) {
                    Customer.comments.id(Customer.comments[i]._id).remove();
                }
                Customer.save(function (err, result) {
                    if (err) next(err);
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('Deleted all comments!');
                });
            });
        });

    CustomerRouter.route('/:CustomerId/comments/:commentId')
        //.all(Verify.verifyOrdinaryUser)
        .get(Verify.verifyOrdinaryUser, function (req, res, next) {
            Customer.findById(req.params.CustomerId)
                .populate('comments.postedBy')
                .exec(function (err, Customer) {
                    if (err) next(err);
                    res.json(Customer.comments.id(req.params.commentId));
                });
        })

        .put(Verify.verifyOrdinaryUser, function (req, res, next) {
            // We delete the existing commment and insert the updated
            // comment as a new comment
            Customer.findById(req.params.CustomerId, function (err, Customer) {
                if (err) next(err);
                Customer.comments.id(req.params.commentId).remove();
                req.body.postedBy = req.decoded._id;
                Customer.comments.push(req.body);
                Customer.save(function (err, Customer) {
                    if (err) next(err);
                    console.log('Updated Comments!');
                    res.json(Customer);
                });
            });
        })

        .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
            Customer.findById(req.params.CustomerId, function (err, Customer) {
                if (Customer.comments.id(req.params.commentId).postedBy
                    != req.decoded._id) {
                    var err = new Error('You are not authorized to perform this operation!');
                    err.status = 403;
                    return next(err);
                }
                Customer.comments.id(req.params.commentId).remove();
                Customer.save(function (err, resp) {
                    if (err) next(err);
                    res.json(resp);
                });
            });
        });
    return CustomerRouter;
};

module.exports = routes;