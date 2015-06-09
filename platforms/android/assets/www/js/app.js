'use strict';
// Declare app level module which depends on views, and components
angular.module('ClazzManager', [
  'ngRoute',
  'ClazzManager.diario_classe',
  'ClazzManager.listar-anotacoes', 
  'ClazzManager.home',
  'ClazzManager.registro',
  'ClazzManager.login'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]);