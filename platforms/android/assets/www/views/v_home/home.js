'use strict';

angular.module('ClazzManager.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/v_home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', [function() {
              
}]);