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
    controller: 'AvaliacaoCtrl'
  })
  .when('/diario_classe/listar_presencas', {
    templateUrl: 'views/v_diario_classe/listar_presencas.html',
    controller: 'AulaCtrl'
  })
  .when('/diario_classe/adicionar-aula', {
    templateUrl: 'views/v_diario_classe/adicionar-aula.html',
    controller: 'AulaCtrl'
  })
  .when('/diario_classe/editar-aula/:codigo', {
    templateUrl: 'views/v_diario_classe/adicionar-aula.html',
    controller: 'EditarAulaCtrl'
  })
  .when('/lancar_presencas/:codigo', {
    templateUrl: 'views/v_diario_classe/lancar-presenca.html',
    controller: 'PresencaCtrl'
  })              
  .when('/diario_classe/adicionar-avaliacao/', {
    templateUrl: 'views/v_diario_classe/adicionar-avaliacao.html',
    controller: 'AvaliacaoCtrl'
  })
  .when('/diario_classe/editar-avaliacao/:codigo', {
    templateUrl: 'views/v_diario_classe/adicionar-avaliacao.html',
    controller: 'EditarAvaliacaoCtrl'
  })
  .when('/lancar-notas/:codigo', {
    templateUrl: 'views/v_diario_classe/lancar-notas.html',
    controller: 'LancarNotaCtrl'
  });
}])

.controller('DiarioClasseCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
    $scope.aluno = {codigo:null, pessoa_tipo:0, contato_codigo:0, login_codigo:0, nome:'', dataNascimento:'', genero:'', situacao:'', nivelAcesso:0, foto:null};
    $scope.aluno.situacao = 'ativo';
    $scope.aluno.genero = 'M';
    $scope.db = prepareDatabase();
    
    $scope.init = function(){
        if($routeParams.codigo !== undefined){
            $scope.db.transaction(function(t) {
                t.executeSql("SELECT * FROM Pessoa where pessoa_tipo = ? and codigo = ?", [ 1, $routeParams.codigo], 
                function(t, results) {                    
                    var record = results.rows.item(0);
                    $scope.aluno.codigo = record.codigo;
                    $scope.aluno.nome = record.nome; 
                    $scope.aluno.dataNascimento = record.dataNascimento;
                    $scope.aluno.genero = record.genero;
                    $scope.aluno.situacao = record.situacao;
                    
                    $scope.$apply();
                }, function(e) {               
                    alert("Error: " + e.message);
                });              
            });            
        };
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
                    [1, 1, 0, $scope.aluno.nome, $scope.aluno.dataNascimento, $scope.aluno.genero, $scope.aluno.situacao, 3 ], function(t, results) {
                        alert('Registro salvo com sucesso') ;                
                    }, function(t, e) {
                        // couldn't read database
                        alert("Error: " + e.message);
                    });
                });
            } else {
                $scope.db.transaction(function(t) {
                    t.executeSql("update pessoa set nome = ?, dataNascimento = ?, genero = ?, situacao = ?  where codigo = ?", [$scope.aluno.nome, $scope.aluno.dataNascimento, $scope.aluno.genero, $scope.aluno.situacao, $scope.aluno.codigo], function(t, results) {
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
        $scope.db.transaction(function(t) {
            t.executeSql("SELECT * FROM Pessoa where pessoa_tipo = ?", [1], function(t, results) {
                $scope.alunos.splice(0, $scope.alunos.length);
                for (var i = 0; i < results.rows.length; i++) {
                  var record = results.rows.item(i);                  
                  $scope.alunos.push(record); 
                }
                $scope.$apply();
            }, function(t, e) {               
                $scope.$apply();
            });
        });
    };
    
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
    $scope.alunos = [];
    $scope.db = prepareDatabase();
    
    function listarAlunos(){
        $scope.db.transaction(function(t) {
            t.executeSql("SELECT * FROM Pessoa where pessoa_tipo = ? and situacao = ?", [1, 'ativo'], function(t, results) {
                $scope.alunos.splice(0, $scope.alunos.length);
                
                for (var i = 0; i < results.rows.length; i++) {
                    var record = results.rows.item(i);                  
                    $scope.alunos.push({ aluno:record, presente:false, obs:'', presencaCodigo:null });
                    
                    t.executeSql("SELECT * FROM presenca where aula = ? and pessoa = ?", [$routeParams.codigo, $scope.alunos[i].aluno.codigo], 
                    function(t, presenca){
                        if (presenca.rows.length > 0){
                            for (var j = 0; j< $scope.alunos.length; j++){
                                if ($scope.alunos[j].aluno.codigo === presenca.rows.item(0).pessoa){
                                    $scope.alunos[j].presencaCodigo = presenca.rows.item(0).codigo;
                                    $scope.alunos[j].presente = (presenca.rows.item(0).situacao === 'presente');
                                    $scope.alunos[j].obs = presenca.rows.item(0).observacao;
                                    break;
                                };
                            };                        
                        };
                        
                        $scope.$apply();
                    }, function(t, e) {               
                        alert('Erro: ' + e.message);
                    });
                };
                
                $scope.$apply();             
            }, function(t, e) {               
                alert('Erro: ' + e.message);
            });
        });
    };  
    
    $scope.init = function(){
        listarAlunos();        
    };
    $scope.init();
   
    $scope.salvar = function(){       
        $scope.db.transaction(function(t) {
            var aula = $routeParams.codigo;
            for (var i = 0; i < $scope.alunos.length; i++){        
                var presenca = {codigo:null, aula:'', pessoa:0, dataHora:'', situacao:'', observacao:''};
                
                presenca.aula = aula;
                presenca.pessoa = $scope.alunos[i].aluno.codigo;
                if ($scope.alunos[i].presente) 
                    presenca.situacao = 'presente';
                else
                    presenca.situacao = 'ausente';
                presenca.observacao = $scope.alunos[i].obs;           
                
                if($scope.alunos[i].presencaCodigo === null){
                    t.executeSql("insert into Presenca (aula, pessoa, dataHora, situacao, observacao) values  (?, ?, DateTime(), ?, ?)", 
                    [presenca.aula, presenca.pessoa, presenca.situacao, presenca.observacao], 
                    console.log('registro salvo com sucesso. Codigo: ' + presenca.pessoa), 
                    function(t, e) {                        
                        console.log("Error: " + e.message);
                    });    
                } else {
                    t.executeSql("update Presenca set dataHora=DateTime(), situacao = ?, observacao=? where aula = ? and pessoa = ?",
                    [presenca.situacao, presenca.observacao, presenca.aula, presenca.pessoa], 
                    console.log('registro alterado com sucesso. Codigo: ' + presenca.pessoa), 
                    function(t, e) {                        
                        console.log("Error: " + e.message);
                    });
                };
            };       
            $location.path("/diario_classe/listar_presencas"); 
            $scope.$apply();
        });
    };

    $scope.cancelar = function() {
        $location.path("/diario_classe/listar_presencas");
    };
   
}])
.controller('AulaCtrl', ['$scope', '$location', function($scope, $location){
    $scope.aula = {codigo:null, data:'', descricao:'', horaInicio:'', horaFim:''};
    $scope.aulas = [];

    $scope.db = prepareDatabase();
    
    function listarAulas(){
        $scope.listaVazia = '';
        $scope.db.transaction(function(t) {
            t.executeSql("SELECT * FROM Aula", [], function(t, results) {
                $scope.aulas.splice(0, $scope.aulas.length);
                for (var i = 0; i < results.rows.length; i++) {
                    var record = results.rows.item(i);                  
                    $scope.aulas.push(record); 
                }
                $scope.$apply();
            }, function(e) {
                alert(e.message);
                $scope.listaVazia = 'Não possuem aulas cadastradas';
                $scope.$apply();
            });
        });
    }
    
    $scope.init = function(){        
        listarAulas();
    };
    $scope.init();

    $scope.excluir = function(aula) {
        if (confirm('Deseja excluir esta aula \n' + aula.codigo + ' - '  + aula.data + '. '  + aula.descricao + '?') === true){
            $scope.db.transaction(function(t) {
                t.executeSql("delete from aula where codigo = ?", [aula.codigo], null, null);
                listarAulas();
            });
        }
    };
    
    $scope.salvar = function(){
        if ($scope.aula.descricao === ''){
          alert('O campo descricao deve ser preenchido');              
        } else if ($scope.aula.data === ''){ 
          alert('O campo de data deve ser preenchido');
        } else if ($scope.aula.horaInicio === ''){ 
          alert('O campo de data deve ser preenchido');
        } else if ($scope.aula.horaFim === ''){ 
          alert('O campo de data deve ser preenchido');
        } else {
            if ($scope.aula.codigo === null){
                $scope.db.transaction(function(t) {
                    t.executeSql("insert into aula (data, descricao, horaInicio, horaFim) values  (?, ?, ?, ?)", 
                    [$scope.aula.data, $scope.aula.descricao, $scope.aula.horaInicio, $scope.aula.horaFim], function(t, results) {
                        alert('Registro salvo com sucesso') ;                
                    }, function(e) {                        
                        alert("Error: " + e.message);
                    });
                });
            } else {
                $scope.db.transaction(function(t) {
                    t.executeSql("update aula set data = ?, descricao = ?, horaInicio = ?, horaFim = ?  where codigo = ?", [$scope.aula.data, $scope.aula.descricao, $scope.aula.horaInicio, $scope.aula.horaFim, $scope.aula.codigo], 
                    function(t, results) {
                        alert('Registro alterado com sucesso') ;                
                    }, function(t, e) {                       
                        alert("Error: " + e.message);
                    });
                });
            }
            $location.path("/diario_classe/listar_presencas");
        }
    };

    $scope.editar = function(mostraAulas){
        $location.path("/diario_classe/editar-aula/" + mostraAulas.codigo);
        console.log(mostraAulas);
    };


    $scope.novaAula = function() {
        $location.path("/diario_classe/adicionar-aula");
    };
    
    
    $scope.cancelar = function(){
       $location.path("/diario_classe/listar_presencas");
    };
   
}])
.controller('EditarAulaCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location){
    $scope.db = prepareDatabase();
    $scope.aula = {codigo:null, data:'', descricao:'', horaInicio:'', horaFim:''};
    
    $scope.init = function(){
        if($routeParams.codigo !== null){
            $scope.db.transaction(function(t) {
                t.executeSql("SELECT * FROM Aula where codigo = ?", [$routeParams.codigo], 
                function(t, results) {                                        
                    var record = results.rows.item(0);
                    console.log(record);
                    console.log($scope.aula);
                    $scope.aula.codigo = record.codigo;
                    $scope.aula.descricao = record.descricao; 
                    $scope.aula.data = record.data;
                    $scope.aula.horaInicio = record.horaInicio;
                    $scope.aula.horaFim = record.horaFim;
                    
                    $scope.$apply();
                }, function(e) {               
                    alert("Error: " + e.message);
                });              
            });            
        };
    };
    $scope.init();
    
    $scope.salvar = function(){
        if ($scope.aula.descricao === ''){
          alert('O campo descricao deve ser preenchido');              
        } else if ($scope.aula.data === ''){ 
          alert('O campo de data deve ser preenchido');
        } else if ($scope.aula.horaInicio === ''){ 
          alert('O campo de data deve ser preenchido');
        } else if ($scope.aula.horaFim === ''){ 
          alert('O campo de data deve ser preenchido');
        } else {
            
            $scope.db.transaction(function(t) {
                t.executeSql("update aula set data = ?, descricao = ?, horaInicio = ?, horaFim = ?  where codigo = ?", [$scope.aula.data, $scope.aula.descricao, $scope.aula.horaInicio, $scope.aula.horaFim, $scope.aula.codigo], 
                function(t, results) {
                    alert('Registro alterado com sucesso') ;                
                }, function(e) {                       
                    alert("Error: " + e.message);
                });
            });

            $location.path("/diario_classe/listar_presencas");
        }
    };
    
    $scope.cancelar = function(){
       $location.path("/diario_classe/listar_presencas");
    };

}])
.controller('AvaliacaoCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location){
    $scope.db = prepareDatabase();
    $scope.avaliacao = {codigo:null, descricao:'', data:''};
    $scope.avaliacoes = [];
    
    $scope.init = function(){      
        listarAvaliacoes();
    };
    $scope.init();
    
    function listarAvaliacoes(){        
        $scope.db.transaction(function(t) {
            t.executeSql("SELECT * FROM Avaliacao", [], function(t, results) {
                $scope.avaliacoes.splice(0, $scope.avaliacoes.length);
                for (var i = 0; i < results.rows.length; i++) {
                    var record = results.rows.item(i);                  
                    $scope.avaliacoes.push(record); 
                };
                $scope.$apply();
            }, function(t, e) {
                alert(e.message);
                $scope.$apply();
            });
        });
    }
    
    $scope.excluir = function(avaliacao) {
        if (confirm('Deseja excluir esta avaliação \n' + avaliacao.codigo + ' - '  + avaliacao.descricao + '?') === true){
            $scope.db.transaction(function(t) {
                t.executeSql("delete from avaliacao where codigo = ?", [avaliacao.codigo], null, null);
                listarAvaliacoes();
            });
        }
    };
    
    $scope.salvar = function(){
        if ($scope.avaliacao.descricao === ''){
          alert('O campo descricao deve ser preenchido');              
        } else if ($scope.avaliacao.data === ''){ 
          alert('O campo de data deve ser preenchido');
        } else {
            
            $scope.db.transaction(function(t) {
                t.executeSql("insert into avaliacao (descricao, dataHora) values (?, ?)", [$scope.avaliacao.descricao, $scope.avaliacao.data], 
                function(t, results) {
                    alert('Registro salvo com sucesso') ;                
                }, function(t, e) {                       
                    alert("Error: " + e.message);
                });
            });

            $location.path("/diario_classe/listar_avaliacoes");
        }
    };
    
    $scope.cancelar = function(){
       $location.path("/diario_classe/listar_avaliacoes");
    };
    
    $scope.novaAvaliacao = function() {
        $location.path("/diario_classe/adicionar-avaliacao");
    };
    
    $scope.editar = function(Avaliacao){
        $location.path("/diario_classe/editar-avaliacao/" + Avaliacao.codigo);
        console.log(Avaliacao);
    };

}])
.controller('EditarAvaliacaoCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location){
    $scope.db = prepareDatabase();
    $scope.avaliacao = {codigo:null, descricao:'', data:''};
    
    $scope.init = function(){
        if($routeParams.codigo !== null){
            $scope.db.transaction(function(t) {
                t.executeSql("SELECT * FROM avaliacao where codigo = ?", [$routeParams.codigo],
                function(t, results) {                                        
                    var record = results.rows.item(0);
                    console.log(record);
                    console.log($scope.avaliacao);
                    $scope.avaliacao.codigo = record.codigo;
                    $scope.avaliacao.descricao = record.descricao; 
                    $scope.avaliacao.data = record.dataHora;
                    
                    $scope.$apply();
                }, function(t, e) {               
                    alert("Error: " + e.message);
                });              
            });            
        };
    };
    $scope.init();
    
    $scope.salvar = function(){
        if ($scope.avaliacao.descricao === ''){
          alert('O campo descricao deve ser preenchido');              
        } else if ($scope.avaliacao.data === ''){ 
          alert('O campo de data deve ser preenchido');
        } else {
            
            $scope.db.transaction(function(t) {
                t.executeSql("update avaliacao set descricao = ?, dataHora = ? where codigo = ?", [$scope.avaliacao.descricao, $scope.avaliacao.data, $scope.avaliacao.codigo], 
                function(t, results) {
                    alert('Registro alterado com sucesso') ;                
                }, function(t, e) {                       
                    alert("Error: " + e.message);
                });
            });

            $location.path("/diario_classe/listar_avaliacoes");
        }
    };
    
    $scope.cancelar = function(){
       $location.path("/diario_classe/listar_avaliacoes");
    };

}])
.controller('LancarNotaCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location){
    $scope.alunos = [];
    $scope.db = prepareDatabase();
    
    function listarAlunos(){
        $scope.db.transaction(function(t) {
            t.executeSql("SELECT * FROM Pessoa where pessoa_tipo = ? and situacao = ?", [1, 'ativo'], function(t, results) {
                $scope.alunos.splice(0, $scope.alunos.length);
                
                for (var i = 0; i < results.rows.length; i++) {
                    var record = results.rows.item(i);                  
                    $scope.alunos.push({ aluno:record, nota:null, codigoNota:null });
                    
                    t.executeSql("SELECT * FROM Nota where avaliacao = ? and pessoa = ?", [$routeParams.codigo, $scope.alunos[i].aluno.codigo], 
                    function(t, nota){                        
                        if (nota.rows.length > 0){
                            for (var j = 0; j < $scope.alunos.length; j++){
                                if ($scope.alunos[j].aluno.codigo === nota.rows.item(0).pessoa){
                                    $scope.alunos[j].codigoNota = nota.rows.item(0).codigo;                                    
                                    $scope.alunos[j].nota = nota.rows.item(0).nota;                                    
                                    break;
                                };
                            };                        
                        };                      
                        $scope.$apply();
                    }, function(t, e) {               
                        alert('Erro: ' + e.message);
                    });
                };
                console.log($scope.alunos);
                $scope.$apply();             
            }, function(t, e) {               
                alert('Erro: ' + e.message);
            });
        });
    };  
    
    $scope.init = function(){
        listarAlunos();         
    };
    $scope.init();
   
   $scope.validarNotas = function(){
       var valida = true;
       
       for (var n = 0; n < $scope.alunos.length; n++){
            if (($scope.alunos[n].nota < 0) || ($scope.alunos[n].nota > 10)){
                alert('Nota inválida do aluno ' + $scope.alunos[n].aluno.codigo + '-' + $scope.alunos[n].aluno.nome);
                valida = false;
                break;
            };
        };
        if (valida){
            $scope.salvar();
        };
    };
   
    $scope.salvar = function(){              
        $scope.db.transaction(function(t) {
            var avaliacao = $routeParams.codigo;
            for (var i = 0; i < $scope.alunos.length; i++){        
                var nota = {codigo:null, pessoa:0, avaliacao:null, nota:0, dataHora:''};                                
                
                nota.avaliacao = avaliacao;
                nota.pessoa = $scope.alunos[i].aluno.codigo;
                nota.nota = $scope.alunos[i].nota;                                

                if($scope.alunos[i].codigoNota === null){
                    t.executeSql("insert into nota (avaliacao, pessoa, dataHora, nota, diario_classe) values  (?, ?, DateTime(), ?, ?)", 
                    [nota.avaliacao, nota.pessoa, nota.nota, 1], 
                    console.log('registro salvo com sucesso. Codigo: ' + nota.pessoa), 
                    function(t, e) {                        
                        console.log("Error: " + e.message);
                    });    
                } else {
                    t.executeSql("update nota set dataHora=DateTime(), nota=? where avaliacao = ? and pessoa = ?",
                    [nota.nota, nota.avaliacao, nota.pessoa], 
                    console.log('registro alterado com sucesso. Codigo: ' + nota.pessoa), 
                    function(t, e) {                        
                        console.log("Error: " + e.message);
                    });
                };
            };       
            $location.path("/diario_classe/listar_avaliacoes"); 
            $scope.$apply();
        });
    };

    $scope.cancelar = function() {
        $location.path("/diario_classe/listar_avaliacoes");
    };   
}]);