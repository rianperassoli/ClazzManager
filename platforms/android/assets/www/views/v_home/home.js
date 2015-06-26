'use strict';

angular.module('ClazzManager.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/v_home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location){
        
    $scope.init = function(){
        console.log($rootScope.usuarioLogado + 'login, usuario');
    };
    $scope.init();
      
      
    $scope.sair = function()  {
        $location.path('login');
    };
}]);