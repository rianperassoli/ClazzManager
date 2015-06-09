'use strict';

angular.module('ClazzManager.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/v_login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
        
        $scope.Entrar = function (){
            $location.path("/home");
        };
              
}]);