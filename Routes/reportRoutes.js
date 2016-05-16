var express = require('express');
var Verify = require('./verify');
var routes = function (Report) {
    var ReportRouter = express.Router();

    var ReportController = require('../controllers/reportController')(Report);
    ReportRouter.route('/')
        .post(Verify.verifyOrdinaryUser,  ReportController.post)
        .get(Verify.verifyOrdinaryUser, ReportController.get);

    ReportRouter.use('/:ReportId', function (req, res, next) {
        Report.findById(req.params.ReportId)
            .populate('postedBy')
            .exec(function (err, Report) {
                if (err)
                    res.status(500).send(err);
                else if (Report) {
                    req.Report = Report;
                    next();
                }
                else {
                    res.status(404).send('no Report found');
                }
            });
    });
    ReportRouter.route('/:ReportId')
        .get(function (req, res) {
            var returnReport = req.Report.toJSON();
            returnReport.links = {};
            var newLink_1 = 'http://' + req.headers.host + '/api/Reports/?weekNumber=' + returnReport.weekNumber;
            returnReport.links.FilterByWeekNumber = newLink_1.replace(' ', '%20');
            res.json(returnReport);

        })
        .put(function (req, res) {
            req.Report.currentWeek = req.body.currentWeek;
            req.Report.nextWeek = req.body.nextWeek;
            req.Report.weekNumber = req.body.weekNumber;
            req.Report.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.json(req.Report);
                }
            });
        })
        .patch(function (req, res) {
            if (req.body._id)
                delete req.body._id;

            for (var p in req.body) {
                req.Report[p] = req.body[p];
            }

            req.Report.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.json(req.Report);
                }
            });
        })
        .delete(function (req, res) {
            req.Report.remove(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.status(204).send('Removed');
                }
            });
        });
    return ReportRouter;
};

module.exports = routes;