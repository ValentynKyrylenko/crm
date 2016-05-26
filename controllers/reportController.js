var reportController = function (Report) {
    var post = function (req, res) {
        req.body.postedBy = req.decoded._id;
        var report = new Report(req.body);
        if (!req.body.currentWeek) {
            res.status(400);
            res.send('Week number and number of weak are required');
        }
        else {
            report.save();
            res.status(201);
            res.send(report);
        }
    };
    var get = function (req, res) {
        var query = {};
        if (req.query.weekNumber) {
            query.weekNumber = req.query.weekNumber;
        }
        Report.find(query).populate('postedBy')
            .exec(function (err, reports) {
                if (err)
                    res.status(500).send(err);
                else {
                    var returnReports = [];
                    reports.forEach(function (element, index, array) {
                        var newReport = element.toJSON();
                        newReport.links = {};
                        newReport.links.self = 'http://' + req.headers.host + '/api/reports/' + newReport._id;
                        returnReports.push(newReport);
                    });
                    res.json(returnReports);
                }
            });
    };
    return {
        post: post,
        get: get
    };
};
module.exports = reportController;