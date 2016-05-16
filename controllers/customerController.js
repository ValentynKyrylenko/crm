var customerController = function (Customer) {
    var post = function (req, res) {
        var customer = new Customer(req.body);
        if (!req.body.name || !req.body.email) {
            res.status(400);
            res.send('Name and email are required');
        }
        else {
            customer.save();
            res.status(201);
            res.send(customer);
        }
    };
    var get = function (req, res) {
        var query = {};
        if (req.query.product) {
            query.product = req.query.product;
        }
        else if (req.query.manager) {
            query.manager = req.query.manager;
        }
        else if (req.query.country) {
            query.country = req.query.country;
        }
        else if (req.query.stage) {
            query.stage = req.query.stage;
        }
        Customer.find(query).populate('comments.postedBy')
            .exec(function (err, customers) {
                if (err)
                    res.status(500).send(err);
                else {
                    var returnCustomers = [];
                    customers.forEach(function (element, index, array) {
                        var newCustomer = element.toJSON();
                        newCustomer.links = {};
                        newCustomer.links.self = 'http://' + req.headers.host + '/api/customers/' + newCustomer._id;
                        returnCustomers.push(newCustomer);
                    });
                    res.json(returnCustomers);
                }
            });
    };
    return {
        post: post,
        get: get
    };
};
module.exports = customerController;