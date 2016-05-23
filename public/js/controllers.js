'use strict';

angular.module('crmApp')

    .controller('CustomerController', ['$scope', '$state', '$stateParams',  'customerFactory', 'ngDialog', function ($scope, $state, $stateParams,  customerFactory, ngDialog) {


        customerFactory.query(
            function (response) {
                $scope.customers = response;

            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

        $scope.submitCustomer = function () {

            console.log($scope.customer);
            customerFactory.save($scope.customer);

            $state.go($state.current, {}, {reload: true});

            $scope.customerForm.$setPristine();

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
            ngDialog.open({ template: 'partials/customer_details.html', scope: $scope, className: 'ngdialog-theme-default' });
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
        };

        $scope.updateCustomer = function(customer) { //Update the edited movie. Issues a PUT to /api/movies/:id
            customerFactory.update(customer);
            ngDialog.close();
            $state.go($state.current, {}, {reload: true});
        };
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
            rating: 5,
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
        }
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
        };

        $rootScope.$on('login:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

        $rootScope.$on('registration:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

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
;/**
 * Created by Lenovo on 18.05.2016.
 */
