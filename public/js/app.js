'use strict';

angular.module('crmApp', ['ui.router','ngResource','ngDialog','angularUtils.directives.dirPagination'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

        // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'customers_table': {
                        templateUrl : 'partials/customers_table.html',
                        controller  : 'CustomerController'
                    },
                    'quick_post_customers': {
                        templateUrl : 'partials/quick_post_customers.html',
                        controller  : 'CustomerController'
                    },
                    'side': {
                        templateUrl : 'partials/side.html',
                    }
                }

            });

            //// route for the aboutus page
            //.state('app.aboutus', {
            //    url:'aboutus',
            //    views: {
            //        'content@': {
            //            templateUrl : 'views/aboutus.html',
            //            controller  : 'AboutController'
            //        }
            //    }
            //})
            //
            //// route for the contactus page
            //.state('app.contactus', {
            //    url:'contactus',
            //    views: {
            //        'content@': {
            //            templateUrl : 'views/contactus.html',
            //            controller  : 'ContactController'
            //        }
            //    }
            //})
            //
            //// route for the menu page
            //.state('app.menu', {
            //    url: 'menu',
            //    views: {
            //        'content@': {
            //            templateUrl : 'views/menu.html',
            //            controller  : 'MenuController'
            //        }
            //    }
            //})
            //
            //// route for the dishdetail page
            //.state('app.dishdetails', {
            //    url: 'menu/:id',
            //    views: {
            //        'content@': {
            //            templateUrl : 'views/dishdetail.html',
            //            controller  : 'DishDetailController'
            //        }
            //    }
            //})
            //
            //// route for the dishdetail page
            //.state('app.favorites', {
            //    url: 'favorites',
            //    views: {
            //        'content@': {
            //            templateUrl : 'views/favorites.html',
            //            controller  : 'FavoriteController'
            //        }
            //    }
            //});

        $urlRouterProvider.otherwise('/');
    })
;
