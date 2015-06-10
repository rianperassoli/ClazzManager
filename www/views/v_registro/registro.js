'use strict';

angular.module('ClazzManager.registro', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/registro', {
    templateUrl: 'views/v_registro/registro.html',
    controller: 'RegistroCtrl'
  });
}])

.controller('RegistroCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location){
            
    $scope.db = prepareDatabase();        
            
    $scope.registro = {codigo:null, nome:'', dataNascimento:'', tipoPessoa:'', login:'', senha:'', confirmaSenha:'', foto:''};

    $scope.registro.tipoPessoa = 'aluno';

    $scope.tirarFoto = function(){
        navigator.camera.getPicture(onFotoSuccess, onFotoFail, {quality: 50, destinationType: Camera.DestinationType.DATA_URL});
        
        function onFotoSuccess(foto){
            $scope.fotoPessoa = "data:image/jpeg;base64," + foto; 
        }
        
        function onFotoFail(foto){
            navigator.notification.alert ("Falha ao capturar foto: " , null, "Falha", ["OK"]);
        }
    };  
    
    $scope.salvar = function(){ 
        if ($scope.registro.nome === ''){
           alert('O campo nome deve ser preenchido');
        } else if ($scope.registro.dataNascimento === ''){
           alert('O campo data deve ser preenchido'); 
        } else if ($scope.registro.login === ''){
            alert('O campo login deve ser preenchido');
        } else if ($scope.senha === ''){
            alert('O campo senha deve ser preenchido');
        } else if ($scope.confirmaSenha === ''){
            alert('O campo de confirmação de senha deve ser preenchido');
        } else if ($scope.senha !== $scope.confirmaSenha){
            alert('As senhas não coincidem');
        } else {
            if($scope.registro.tipoPessoa === 'aluno'){
                $scope.registro.tipoPessoa = 1;
            } else {
                $scope.registro.tipoPessoa = 2;
            };
            
            $scope.db.transaction(function(t) {                
                t.executeSql("select codigo, login_codigo, nome, dataNascimento from Pessoa where nome = ? and dataNascimento = ?", [$scope.registro.nome, $scope.registro.dataNascimento], function(t, results) {                    
                    if(results.rows.length > 0){
                        $scope.registro.codigo = results.rows.item(0).codigo;
                        if(results.rows.item(0).login_codigo > 0){
                            alert('Você já possui um usuário cadastrado');
                        } else {
                            $scope.db.transaction(function(t) {                
                                t.executeSql("insert into Login (usuario, senha) values (?, ?)", [$scope.registro.login, $scope.registro.senha], function(t, results) {

                                    console.log('usuário cadastrado com sucesso');
                                  
                                    t.executeSql("select * from Login where usuario = ? and senha = ?", [$scope.registro.login, $scope.registro.senha], function(t, results) {                                       
                                        t.executeSql("update Pessoa set login_codigo = ? where codigo = ? ", [results.rows.item(0).codigo, $scope.registro.codigo],function(){console.log('pessoa recebeu o codigo de login');});
                                    });
                                    
                                });
                            });
                        };                        
                    } else {                        
                        $scope.db.transaction(function(t) {
                            t.executeSql("insert into Login (usuario, senha) values (?, ?)", [$scope.registro.login, $scope.registro.senha], 
                            function(t, results) {
                                console.log('login inserido');
                                
                                t.executeSql("insert into Pessoa (pessoa_Tipo, login_codigo, nome, dataNascimento, situacao, nivelAcesso) values (?, ?, ?, ?, ?, ?)", 
                                [$scope.registro.tipoPessoa, 0, $scope.registro.nome, $scope.registro.dataNascimento, 'ativo', 1], 
                                function(t, results) {console.log('Usuário cadastrado com sucesso');});
                            });
                            
                        });
                        
                        $scope.db.transaction(function(t) {
                            
                            t.executeSql("select codigo from Pessoa where nome = ? and dataNascimento = ?", [$scope.registro.nome, $scope.registro.dataNascimento], 
                            function(t, results) {                             
                                $scope.registro.codigo = results.rows.item(0).codigo;
                                
                                t.executeSql("select * from Login where usuario = ? and senha = ? ", [$scope.registro.login, $scope.registro.senha],
                                function(){
                                    t.executeSql("select * from Login where usuario = ? and senha = ? ", [$scope.registro.login, $scope.registro.senha],function(){
                                        t.executeSql("update Pessoa set login_codigo = ? where codigo = ? ", [results.rows.item(0).codigo, $scope.registro.codigo],function(){console.log('pessoa recebeu o codigo de login');});
                                    });
                                });                                                
                            });                            
                        });
                    };
                });                                                                
            });
            
            $location.path("/login");
        };
    };
    
    $scope.cancelar = function(){
       $location.path("/login");
    };
}]);