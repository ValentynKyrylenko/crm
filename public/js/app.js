'use strict';

angular.module('crmApp', ['ui.router','ngResource','ngDialog','angularUtils.directives.dirPagination'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

        // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'statistics':{
                        templateUrl : 'partials/statistics.html'
                    },
                    'map':{
                        templateUrl : 'partials/map.html'
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
