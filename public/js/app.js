'use strict';

angular.module('crmApp', ['ui.router','ngResource','ngDialog', 'angularUtils.directives.dirPagination','chart.js', 'pikaday','angularMoment'])
    .config(['ChartJsProvider', function (ChartJsProvider) {
        // Configure all charts
        ChartJsProvider.setOptions({
            //colours: ['#FF5252', '#FF8A80'],
            responsive: false
        });
        // Configure all line charts
        ChartJsProvider.setOptions('Line', {
            datasetFill: false
        });
    }])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

        // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'statistics':{
                        templateUrl : 'partials/statistics.html',
                        controller  : 'StatisticsController'
                    },
                    'map':{
                        templateUrl : 'partials/map.html'
                    },
                    'sideStatistics':{
                        templateUrl : 'partials/sidestatistics.html',
                        controller  : 'StatisticsController'
                    },
                    'header':{
                        templateUrl : 'partials/header.html',
                        controller  : 'HeaderController'
                    },
                    'sidebar':{
                        templateUrl : 'partials/sidebar.html'
                    },
                    'calendar':{
                        templateUrl : 'partials/calendar.html'
                    },
                    'quick_post_customers': {
                        templateUrl : 'partials/quick_post_customers.html',
                        controller  : 'CustomerController'
                    },
                    'quick_post_report': {
                        templateUrl : 'partials/report_create.html',
                        controller  : 'ReportsController'
                    }
                }

            })
            // route for the customers page
            .state('app.customers', {
                url: 'api/customers',
                views: {
                    'content@': {
                        templateUrl : 'partials/customers_table.html',
                        controller  : 'CustomerController'
                    }
                }
            })

        // route for the customers detail page
        .state('app.customerdetails', {
            url: 'api/customers/:id',
            views: {
                'content@': {
                    templateUrl : 'partials/customerdetail.html',
                    controller  : 'CustomerDetailController'
                }
            }
        })

        // route for the reports page
            .state('app.reports', {
                url: 'api/reports',
                views: {
                    'content@': {
                        templateUrl : 'partials/reports_table.html',
                        controller  : 'ReportsController'
                    }
                }
            })

            // route for reports detail page
            .state('app.reportdetails', {
                url: 'api/reports/:id',
                views: {
                    'content@': {
                        templateUrl : 'partials/reportdetail.html',
                        controller  : 'ReportDetailController'
                    }
                }
            })

            // route for the users page
            .state('app.users', {
                url: 'api/users',
                views: {
                    'content@': {
                        templateUrl : 'partials/users_table.html',
                        controller  : 'UsersController'
                    }
                }
            })

            // route for user detail page
            .state('app.userdetails', {
                url: 'api/users/:id',
                views: {
                    'content@': {
                        templateUrl : 'partials/userdetail.html',
                        controller  : 'UserDetailController'
                    }
                }
            })


        $urlRouterProvider.otherwise('/');
    })
;
