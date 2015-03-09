var app = angular.module("nexp", ['LocalStorageModule']);

app.config(function(localStorageServiceProvider){
  localStorageServiceProvider
    .setPrefix('nexp')
    .setStorageType('localStorage')
    //.setStorageType('sessionStorage')
    .setStorageCookieDomain('example.com')
    .setNotify(true, true);
});

app.controller('initData', function($scope, $http, localStorageService){
	localStorageService.clearAll();

	//localStorageService.set('localStorageDemo', 'oldValue');

	if (localStorageService.getStorageType().indexOf('session') >= 0) {
      console.log('StorageType: Session storage');
    }

    if (!localStorageService.isSupported) {
      console.log('StorageType: Cookie');
    }

    $scope.data = "data/data.json";
    $scope.data = "data/rawData.json";
   	$http.get($scope.data.toString()).success(function (data){
		localStorageService.set('jsonData', data);
    localStorageService.bind($scope, 'jsonData');
		console.log($scope.jsonData.design_guide.variables.dependent_variable.length);
	});

    localStorageService.set('flagOne', true);
    //localStorageService.bind($scope, 'flagOne');
});