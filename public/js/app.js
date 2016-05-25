'use strict';

angular.module('crmApp', ['ui.router','ngResource','ngDialog','angularUtils.directives.dirPagination','chart.js'])
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
                    'quick_post_customers': {
                        templateUrl : 'partials/quick_post_customers.html',
                        controller  : 'CustomerController'
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
        $urlRouterProvider.otherwise('/');
    })
;
