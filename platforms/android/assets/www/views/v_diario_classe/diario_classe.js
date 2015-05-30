'use strict';

angular.module('ClazzManager.diario_classe', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/listar_alunos', {
    templateUrl: 'views/v_diario_classe/listar_alunos.html',
    controller: 'ListaAlunoCtrl'
  })
  .when('/listar_alunos/adicionar', {
    templateUrl: 'views/v_diario_classe/adicionar-aluno.html',
    controller: 'DiarioClasseCtrl'
  })
  .when('/listar_alunos/:codigo', {
    templateUrl: 'views/v_diario_classe/adicionar-aluno.html',
    controller: 'DiarioClasseCtrl'
  })
  .when('/diario_classe/listar_avaliacoes', {
    templateUrl: 'views/v_diario_classe/listar_avaliacoes.html',
    controller: 'DiarioClasseCtrl'
  })
  .when('/diario_classe/listar_presencas', {
    templateUrl: 'views/v_diario_classe/listar_presencas.html',
    controller: 'PresencaCtrl'
  })
  .when('/diario_classe/visualizar/:id', {
    templateUrl: 'views/v_diario_classe/visualizar_alunos.html',
    controller: 'DiarioClasseCtrl'});
}])

.controller('DiarioClasseCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
    $scope.aluno = {codigo:null, pessoa_tipo:0, contato_codigo:0, login_codigo:0, nome:'', dataNascimento:'', genero:'', situacao:'', nivelAcesso:0, foto:null};
    $scope.genero= [{id:'M', descricao:'Masculino'}];
    $scope.db = prepareDatabase();
    
    $scope.init = function(){
        if($routeParams.codigo !== null){
            $scope.db.transaction(function(t) {
                t.executeSql("SELECT * FROM Pessoa where situacao = ? and pessoa_tipo = ? and codigo = ?", ['ativo', 2, $routeParams.codigo], function(t, results) {
                    var record = results.rows.item(0);
                    $scope.aluno.codigo = record.codigo;
                    $scope.aluno.nome = record.nome; 
                    $scope.aluno.dataNascimento = record.dataNascimento;
                    $scope.aluno.genero = record.genero;
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
        if ($scope.aluno.nome === ''){
          alert('O campo nome deve ser preenchido');              
        } else if ($scope.aluno.dataNascimento === ''){ 
          alert('O campo de data de nascimento deve ser preenchido');              
        } else {
            if ($scope.aluno.codigo === null){
                $scope.db.transaction(function(t) {
                    t.executeSql("insert into Pessoa (pessoa_Tipo, contato_codigo, login_codigo, nome, dataNascimento, genero, situacao, nivelAcesso) values  (?, ?, ?, ?, ?, ?, ?, ?)", 
                    [2, 1, 1, $scope.aluno.nome, $scope.aluno.dataNascimento, $scope.aluno.genero, 'ativo', 3 ], function(t, results) {
                        alert('Registro salvo com sucesso') ;                
                    }, function(t, e) {
                        // couldn't read database
                        alert("Error: " + e.message);
                    });
                });
            } else {
                $scope.db.transaction(function(t) {
                    t.executeSql("update pessoa set nome = ?, dataNascimento = ?, genero = ?  where codigo = ?", [$scope.aluno.nome, $scope.aluno.dataNascimento, $scope.aluno.genero, $scope.aluno.codigo], function(t, results) {
                        alert('Registro alterado com sucesso') ;                
                    }, function(t, e) {
                        // couldn't read database
                        alert("Error: " + e.message);
                    });
                });
            }
        $location.path("/listar_alunos");
        }
        
    };

    $scope.cancelar = function(){
       $location.path("/listar_alunos");
    };   
    
}])
.controller('ListaAlunoCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location){
    $scope.alunos = [];

    $scope.db = prepareDatabase();
    
    function listarAlunos(){
        $scope.listaVazia = '';
        $scope.db.transaction(function(t) {
            t.executeSql("SELECT * FROM Pessoa where situacao = ? and pessoa_tipo = ?", ['ativo', 2], function(t, results) {
                $scope.alunos.splice(0, $scope.alunos.length);
                for (var i = 0; i < results.rows.length; i++) {
                  var record = results.rows.item(i);                  
                  $scope.alunos.push(record); 
                }
                $scope.$apply();
            }, function(t, e) {
                // couldn't read database
                $scope.listaVazia = 'Não possuem alunos cadastradas';
                $scope.$apply();
            });
        });
    }
    
    $scope.init = function(){
        listarAlunos();        
    };
    $scope.init();

    $scope.excluir = function(aluno) {
        if (confirm('Deseja excluir este aluno \n' + aluno.codigo + ' - '  + aluno.nome + '?') === true){
            $scope.db.transaction(function(t) {
                t.executeSql("update Pessoa set situacao = 'inativo' where codigo = ?", [aluno.codigo], null, null);
                listarAlunos();
            });
        }
    };

    $scope.novo = function() {
        $location.path("/listar_alunos/adicionar");
    };
   
}])
.controller('PresencaCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location){
    $scope.data = new Date();

    $scope.db = prepareDatabase();
    
    function listarAlunos(){
        $scope.listaVazia = '';
        $scope.db.transaction(function(t) {
            t.executeSql("SELECT * FROM Pessoa where situacao = ? and pessoa_tipo = ?", ['ativo', 2], function(t, results) {
                $scope.alunos.splice(0, $scope.alunos.length);
                for (var i = 0; i < results.rows.length; i++) {
                  var record = results.rows.item(i);                  
                  $scope.alunos.push(record); 
                }
                $scope.$apply();
            }, function(t, e) {
                // couldn't read database
                $scope.listaVazia = 'Não possuem alunos cadastradas';
                $scope.$apply();
            });
        });
    }
    
    $scope.init = function(){
        listarAlunos();        
    };
    $scope.init();

    $scope.excluir = function(aluno) {
        if (confirm('Deseja excluir este aluno \n' + aluno.codigo + ' - '  + aluno.nome + '?') === true){
            $scope.db.transaction(function(t) {
                t.executeSql("update Pessoa set situacao = 'inativo' where codigo = ?", [aluno.codigo], null, null);
                listarAlunos();
            });
        }
    };

    $scope.novo = function() {
        $location.path("/listar_alunos/adicionar");
    };
   
}]);