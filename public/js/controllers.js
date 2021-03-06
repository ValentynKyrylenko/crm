'use strict';

angular.module('crmApp')

    .controller('CustomerController', ['$scope', '$state', '$stateParams',  'customerFactory', 'commentFactory', 'ngDialog', function ($scope, $state, $stateParams,  customerFactory, commentFactory, ngDialog) {


        customerFactory.query(
            function (response) {
                $scope.customers = response;

            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

        $scope.pageSize = 10;

        $scope.submitCustomer = function () {

            customerFactory.save($scope.customer);

            $state.go($state.current, {}, {reload: true});

            $scope.customerForm.$setPristine();
            $scope.customer = {};

            //$scope.customer = customerFactory.get({
            //        id: $stateParams.id
            //    })
            //    .$promise.then(
            //        function (response) {
            //            $scope.customer = response;
            //            $scope.showCustomer = true;
            //        },
            //        function (response) {
            //            $scope.message = "Error: " + response.status + " " + response.statusText;
            //        }
            //    );
        };

        $scope.showCustomer = function (_id) {
            $scope.one_customer = customerFactory.get({
                    id: _id
                })
                .$promise.then(
                    function (response) {
                        $scope.one_customer = response;
                    },
                    function (response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
            ngDialog.open({ template: 'partials/customer_details.html', scope: $scope, className: 'ngdialog-theme-default', controller:"CustomerController" });
        };

        $scope.editCustomer = function (_id) {
            $scope.edit_customer = customerFactory.get({
                    id: _id
                })
                .$promise.then(
                    function (response) {
                        $scope.edit_customer = response;
                    },
                    function (response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
            ngDialog.open({ template: 'partials/edit_customer.html', scope: $scope, className: 'ngdialog-theme-default', controller:"CustomerController" });
            $scope.edit_customer = {};
        };

        $scope.updateCustomer = function(customer) { //Update the edited movie. Issues a PUT to /api/movies/:id
            customerFactory.update(customer);
            ngDialog.close();
            $state.go($state.current, {}, {reload: false});
            $scope.customer = {};
        };



        $scope.submitComment = function () {
            console.log($stateParams.id);

            commentFactory.save({id: $stateParams.id}, $scope.mycomment);

            $state.go($state.current, {}, {reload: true});

            $scope.commentForm.$setPristine();

            $scope.mycomment = {
               comment: ""
            };
        };

        $scope.deletecustomer = function(customer) { // Delete customer. Issues a DELETE to /api/customers/:id
            customerFactory.delete({
                    id: customer
                })
                .$promise.then(
                function (response) {
                    $scope.report = response;
                    $state.go($state.current, {}, {reload: true});
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                });
        };

        //Sweet alert
        $scope.sweet = {};
        $scope.sweet.option = {
            title: "Are you sure?",
            text: "You will not be able to recover this Customer!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false
        }
        $scope.sweet.confirm = {
            title: 'Deleted!',
            text: 'Your Customer has been deleted.',
            type: 'success'
        };

        $scope.sweet.cancel = {
            title: 'Cancelled!',
            text: 'Your Customer is safe',
            type: 'error'
        }

        $scope.checkCancel=function(){
            console.log("check cancel")
        }

        $scope.checkConfirm=function(){
            console.log("check confrim")
        }
    }])


    .controller( 'CustomerDetailController', ['$scope', '$state', '$stateParams', 'customerFactory', 'commentFactory', function ($scope, $state, $stateParams, customerFactory, commentFactory) {

        $scope.customer = {};
        $scope.showCustomer = false;
        $scope.message = "Loading ...";

        $scope.customer = customerFactory.get({
                id: $stateParams.id
            })
            .$promise.then(
                function (response) {
                    $scope.customer = response;
                    $scope.showCustomer = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

        $scope.mycomment = {
            comment: ""
        };

        $scope.submitComment = function () {

            commentFactory.save({id: $stateParams.id}, $scope.mycomment);

            $state.go($state.current, {}, {reload: true});

            $scope.commentForm.$setPristine();

            $scope.mycomment = {
                rating: 5,
                comment: ""
            };
        };
    }])



    .controller('HomeController', ['$scope', 'customerFactory', function ($scope, customerFactory) {
        $scope.showCustomer = false;
        $scope.message = "Loading ...";

        $scope.customer = customerFactory.query({
                //featured: "true"
            })
            .$promise.then(
                function (response) {
                    var customers = response;
                    $scope.customer = customers[0];
                    $scope.showCustomer = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

    }])




    .controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

        $scope.loggedIn = false;
        $scope.username = '';

        if(AuthFactory.isAuthenticated()) {
            $scope.loggedIn = true;
            $scope.username = AuthFactory.getUsername();
        }

        $scope.openLogin = function () {
            ngDialog.open({ template: 'partials/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
        };

        $scope.logOut = function() {
            AuthFactory.logout();
            $scope.loggedIn = false;
            $scope.username = '';
            $rootScope.showcontent = false;
        };

        $rootScope.$on('login:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
            $rootScope.showcontent = true;
        });

        //$rootScope.$on('registration:Successful', function () {
        //    $scope.loggedIn = AuthFactory.isAuthenticated();
        //    $scope.username = AuthFactory.getUsername();
        //});

        $scope.stateis = function(curstate) {
            return $state.is(curstate);
        };

    }])

    .controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

        $scope.loginData = $localStorage.getObject('userinfo','{}');

        $scope.doLogin = function() {
            if($scope.rememberMe)
                $localStorage.storeObject('userinfo',$scope.loginData);

            AuthFactory.login($scope.loginData);

            ngDialog.close();

        };

        $scope.openRegister = function () {
            ngDialog.open({ template: 'partials/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
        };

    }])

    .controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

        $scope.register={};
        $scope.loginData={};

        $scope.doRegister = function() {
            console.log('Doing registration', $scope.registration);

            AuthFactory.register($scope.registration);

            ngDialog.close();

        };
    }])

    //------StatiscticsController
    .controller('StatisticsController', ['$scope', '$state', '$stateParams',  'customerFactory', 'ngDialog', '$timeout', function ($scope, $state, $stateParams,  customerFactory,ngDialog, $timeout) {


        customerFactory.query(
            function (response) {
                $scope.statistics = response;

                $scope.testing = 0;
                $scope.permanent = 0;
                $scope.prospects = 0;
                $scope.proposals = 0;
                $scope.contracts = 0;
                $scope.statistics.forEach(function(d) {
                    if (d.hasOwnProperty('stage') && d['stage'] === 'Testing'){
                        $scope.testing += 1;
                    }
                    else if (d.hasOwnProperty('stage') && d['stage'] === 'Permanent customer'){
                        $scope.permanent +=1;
                    }
                    else if (d.hasOwnProperty('stage') && d['stage'] === 'Prospect'){
                        $scope.prospects +=1;
                    }
                    else if (d.hasOwnProperty('stage') && d['stage'] === 'Initial proposal'){
                        $scope.proposals +=1;
                    }
                    else if (d.hasOwnProperty('stage') && d['stage'] === 'Signed contract'){
                        $scope.contracts +=1;
                    }
                });
                },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });
        $scope.labels = ["Testing stage", "Permanent customers"];
        $scope.labels2 = ["Prospects", "Sent proposals", "Signed contracts"];
        $scope.data = [$scope.testing, $scope.permanent];
        $scope.data2 = [$scope.prospects, $scope.proposals, $scope.contracts];

        $scope.type = 'PolarArea';
        $scope.toggle = function () {
            $scope.type = $scope.type === 'PolarArea' ?
                'Pie' : 'PolarArea';
        };

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        // Simulate async data update
        $timeout(function () {
            $scope.data = [$scope.testing, $scope.permanent];
            $scope.data2 = [$scope.prospects, $scope.proposals, $scope.contracts];
        }, 1000);
    }])

//ReprtDetailController
    .controller( 'ReportDetailController', ['$scope', '$state', '$stateParams', 'reportFactory', function ($scope, $state, $stateParams, reportFactory) {

        $scope.report = {};

        $scope.message = "Loading ...";

        $scope.report = reportFactory.get({
                id: $stateParams.id
            })
            .$promise.then(
                function (response) {
                    $scope.report = response;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );


    }])
//ReportController
    .controller('ReportsController', ['$scope','$state', '$stateParams', 'reportFactory', function ($scope, $state, $stateParams, reportFactory) {
        reportFactory.query(
            function (response) {
                $scope.reports = response;
               },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });
        $scope.today = new Date();

        $scope.submitreport = function () {

            reportFactory.save({id: $stateParams.id}, $scope.report);

            $state.go($state.current, {}, {reload: true});

            $scope.reportForm.$setPristine();

            $scope.report = {

            };
        };

        $scope.deletereport = function(report) { // Delete report. Issues a DELETE to /api/reports/:id
            reportFactory.delete({
                    id: report
                })
                .$promise.then(
                function (response) {
                    $scope.report = response;
                    $state.go($state.current, {}, {reload: true});
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                });
        };
    }])

    //UserDetailController
    .controller( 'UserDetailController', ['$scope', '$state', '$stateParams', 'reportFactory', function ($scope, $state, $stateParams, reportFactory) {

        $scope.report = {};

        $scope.message = "Loading ...";

        $scope.report = reportFactory.get({
                id: $stateParams.id
            })
            .$promise.then(
                function (response) {
                    $scope.report = response;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );


    }])
    //UserController
    .controller('UsersController', ['$scope','$state', '$stateParams', 'userFactory', 'ngDialog', function ($scope, $state, $stateParams, userFactory, ngDialog) {
        userFactory.query(
            function (response) {
                $scope.users = response;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });
        $scope.today = new Date();


        $scope.deleteuser = function(user) { // Delete a user. Issues a DELETE to /api/users/:id
            userFactory.delete({
                    id: user
                })
                .$promise.then(
                function (response) {
                    $scope.report = response;
                    $state.go($state.current, {}, {reload: true});
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                });
        };

        $scope.edituser = function (user) {
            $scope.edit_user = userFactory.get({
                    id: user
                })
                .$promise.then(
                    function (response) {
                        $scope.edit_user = response;
                    },
                    function (response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
            ngDialog.open({ template: 'partials/edit_user.html', scope: $scope, className: 'ngdialog-theme-default', controller:"UsersController" });
        };

        $scope.updateUser = function(user) { //Update the edited user. Issues a PUT to /api/users/:id
            userFactory.update(user);
            ngDialog.close();
            $state.go($state.current, {}, {reload: true});
        };

    }])

