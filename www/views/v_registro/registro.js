'use strict';

angular.module('ClazzManager.registro', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/registro', {
    templateUrl: 'views/v_registro/registro.html',
    controller: 'RegistroCtrl'
  });
}])

.controller('RegistroCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location){
    $scope.registro = {codigo:null, nome:'', dataNascimento:'', tipoPessoa:'', login:'', senha:'', foto:''};

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
        alert($scope.registro.tipoPessoa);
    };
}]);