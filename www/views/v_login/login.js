'use strict';

angular.module('ClazzManager.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/v_login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

    $scope.mensagem = '';   
    $scope.login = {codigo:null, usuario:'', senha:''};
    $scope.db = prepareDatabase();
    $rootScope.usuarioLogado = {nome: '', tipoAluno: false, foto:''};
    
    $scope.Entrar = function (){
        $location.path("/home");
    };

    $scope.carregaFoto = function() {        
        $scope.db.transaction(function(tx){
            tx.executeSql("SELECT * FROM Login WHERE usuario=?", [$scope.login.usuario],
            function (tx, rs) {
                $scope.mensagem = '';
                if (rs.rows.length > 0){                    
                    tx.executeSql("SELECT * FROM Pessoa WHERE login_codigo=?", [rs.rows.item(0).codigo],                    
                    function (t, pessoa) {                    
                        console.log('tem login com codigo do usuario');                        
                        if (pessoa.rows.length > 0 && pessoa.rows.item(0).foto !== null){                            
                            console.log('tem pessoa com codigo do usuario');
                            //$rootScope.usuarioLogado.foto = pessoa.rows.item(0).foto;
                            document.getElementById('foto').src = pessoa.rows.item(0).foto;
                        } else {
                            document.getElementById('foto').src = 'img/student.png';
                        };                        
                    },
                    function(t, e){
                        alert("Erro: " + e.message);
                    });   
                    
                    $scope.$apply();
                    
                } else {
                    $scope.mensagem = 'Login não cadastrado';
                };
                $scope.$apply();
            },

            function(t, e){
                alert("Erro: " + e.message);
            });             
        });    
    };

    $scope.ValidaUsuario = function(){
        $scope.db.transaction(function(tx){
            tx.executeSql("SELECT * FROM Login WHERE usuario=? AND senha=?", [$scope.login.usuario, $scope.login.senha],
            function (tx, rs) {
                if (rs.rows.length > 0){
                    $scope.mensagem = '';
                    $scope.login.codigo = rs.rows.item(0).codigo;
                    
                    tx.executeSql("SELECT * FROM Pessoa WHERE login_codigo=?", [$scope.login.codigo],
                    function (t, pessoa) {
                        if (pessoa.rows.length > 0){
                            console.log(pessoa.rows.item(0).foto);
                            console.log(pessoa);
                            $rootScope.usuarioLogado.nome = pessoa.rows.item(0).nome;
                            $rootScope.usuarioLogado.tipoAluno = (pessoa.rows.item(0).pessoa_Tipo === 1);
                            //$rootScope.usuarioLogado.foto = pessoa.rows.item(0).foto;
                            console.log($rootScope.usuarioLogado);
                        };                      
                    },

                    function(t, e){
                        alert("Erro: " + e.message);
                    });   
                    $scope.$apply();
                    $scope.Entrar(); 
                } else {
                    $scope.mensagem = 'Login inválido';
                };
                $scope.$apply();
            },

            function(t, e){
                alert("Erro: " + e.message);
            });             
        });
    };
}]);