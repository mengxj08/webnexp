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

	localStorageService.set('localStorageDemo', 'oldValue');

	if (localStorageService.getStorageType().indexOf('session') >= 0) {
      console.log('StorageType: Session storage');
    }

    if (!localStorageService.isSupported) {
      console.log('StorageType: Cookie');
    }

   	$http.get('data/data.json').success(function (data){
		$scope.jsonData = data;
		console.log($scope.jsonData.design_guide.variables.dependent_variable.length);
	});

});