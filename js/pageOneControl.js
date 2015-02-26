var app = angular.module("nexp", []);

app.controller('pageOneControl', ['$scope','$rootScope',
  function($scope, $rootScope) {
    console.log($rootScope);
}]);