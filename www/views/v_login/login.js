'use strict';

angular.module('ClazzManager.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/v_login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.mensagem = '';
    $scope.login = {codigo:null, usuario:'', senha:''};
    $scope.db = prepareDatabase();

    $scope.Entrar = function (){
        $location.path("/home");
    };

    $scope.ValidaUsuario = function(){
        $scope.db.transaction(function(tx){
            tx.executeSql("SELECT * FROM Login WHERE usuario=? AND senha=?", [$scope.login.usuario, $scope.login.senha],
            function (tx, rs) {
                if (rs.rows.length > 0){
                    $scope.mensagem = '';
                    $scope.login.codigo = rs.rows.item(0).codigo;
                    $scope.Entrar(); 
                } else {
                    $scope.mensagem = 'Login inválido';
                };
                $scope.$apply();
            },

            function(e){
                alert("Erro: " + e.message);
            });     
        });
    };
}]);