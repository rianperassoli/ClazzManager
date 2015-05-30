'use strict';

angular.module('ClazzManager.listar-anotacoes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/listar-anotacoes', {
    templateUrl: 'views/v_anotacao/listar-anotacoes.html',
    controller: 'ListaAnotacaoCtrl'
  })
  .when('/listar-anotacoes/adicionar', {
    templateUrl: 'views/v_anotacao/adicionar-anotacao.html',
    controller: 'AnotacaoCtrl'
  })
  .when('/listar-anotacoes/:codigo', {
    templateUrl: 'views/v_anotacao/adicionar-anotacao.html',
    controller: 'AnotacaoCtrl'
  });
  
}])

.controller('AnotacaoCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location){
   
    $scope.anotacao = {codigo:null, titulo:'', descricao:''};
    $scope.db = prepareDatabase();
    
    $scope.init = function(){
        if($routeParams.codigo !== undefined){
            $scope.db.transaction(function(t) {
                t.executeSql("select * from Anotacao where codigo = ?", [$routeParams.codigo], function(t, results) {
                    var record = results.rows.item(0);
                    $scope.anotacao.codigo = record.codigo;
                    $scope.anotacao.titulo = record.titulo; 
                    $scope.anotacao.descricao = record.descricao;
                    $scope.$apply();
                });
                
            }, function(t, e) {
                // couldn't read database
                alert("Error: " + e.message);
            });
        }
    };
    $scope.init();
    
    $scope.salvar = function(){
        if ($scope.anotacao.titulo === ''){
          alert('O campo título deve ser preenchido');              
        } else if ($scope.anotacao.descricao === ''){ 
          alert('O campo descricao deve ser preenchido');              
        } else {
            if ($scope.anotacao.codigo === null){
                $scope.db.transaction(function(t) {
                    t.executeSql("insert into Anotacao (titulo, descricao, Pessoa_codigo, data_cadastro) values (?, ?, ?, datetime('now'))", [$scope.anotacao.titulo,$scope.anotacao.descricao, null], function(t, results) {
                        alert('Registro salvo com sucesso') ;                
                    }, function(t, e) {
                        // couldn't read database
                        alert("Error: " + e.message);
                    });
                });
            } else {
                $scope.db.transaction(function(t) {
                    t.executeSql("update Anotacao set titulo = ?, descricao = ? where codigo = ?", [$scope.anotacao.titulo,$scope.anotacao.descricao, $scope.anotacao.codigo], function(t, results) {
                        alert('Registro alterado com sucesso') ;                
                    }, function(t, e) {
                        // couldn't read database
                        alert("Error: " + e.message);
                    });
                });
            }
        $location.path("/listar-anotacoes");
        }
        
    };

    $scope.cancelar = function(){
       $location.path("/listar-anotacoes");
    };
    
    $scope.publicar = function(){
        $scope.db.transaction(function(t) {
            t.executeSql("update Anotacao set data_publicacao = datetime('now')", [], function(t, results) {                       
                alert('Anotação publicada');
            }, function(t, e) {
                // couldn't read database
                alert("Error: " + e.message);
            });
        });
        $location.path("/listar-anotacoes");
    };
    
    $scope.tirarFoto = function(){
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI });

        function onSuccess(imageURI) {
            $scope.db.transaction(function(t) {
                t.executeSql("insert into Anotacao_Arquivo (nome_arquivo, link_arquivo, data_hora, Tipo_Arquivo_codigo) values(?, ?, datetime('now'), ?)", ['teste', imageURI, 1], function(t, results) {                       
                alert('Salvou');
                });
            });
        }

        function onFail(message) {
            alert('Falha ao carregar imagem: ' + message);
        }
    };
}])

.controller('ListaAnotacaoCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location){
    $scope.anotacoes = [];

    $scope.db = prepareDatabase();
    
    function listarAnotacoes(){
        $scope.listaVazia = '';
        $scope.db.transaction(function(t) {
            t.executeSql('SELECT * FROM Anotacao order by data_cadastro desc', [], function(t, results) {
                $scope.anotacoes.splice(0, $scope.anotacoes.length);
                for (var i = 0; i < results.rows.length; i++) {
                  var record = results.rows.item(i);                  
                  $scope.anotacoes.push(record); 
                }
                $scope.$apply();
            }, function(t, e) {
                // couldn't read database
                $scope.listaVazia = 'Não possuem anotações cadastradas';
                $scope.$apply();
            });
        });
    }
    
    $scope.init = function(){
        listarAnotacoes();        
    };
    $scope.init();

    $scope.excluir = function(anotacao) {
        if (confirm('Deseja excluir a anotação \n' + anotacao.codigo + ' - '  + anotacao.titulo + '?') === true){
            $scope.db.transaction(function(t) {
                t.executeSql("delete from anotacao where codigo = ?", [anotacao.codigo], null, null);
                listarAnotacoes();
            });
        }
    };

    $scope.novo = function() {
        $location.path("/listar-anotacoes/adicionar");
    };
   
}]);