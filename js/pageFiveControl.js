var app = angular.module("nexp", ['LocalStorageModule']);

app.config(function(localStorageServiceProvider){
  localStorageServiceProvider
    .setPrefix('nexp')
    .setStorageType('localStorage')
    //.setStorageType('sessionStorage')
    .setStorageCookieDomain('example.com')
    .setNotify(true, true);
});

app.controller('pageFiveControl',function($scope,$http,$window,localStorageService){

	if (localStorageService.getStorageType().indexOf('session') >= 0) {
      console.log('StorageType: Session storage');
    }

    if (!localStorageService.isSupported) {
      console.log('StorageType: Cookie');
    }

    localStorageService.bind($scope, 'jsonData');

    $scope.DownloadFile = function(){
      $http({
          method: 'post',
          url: 'SaveDataToCookies.php',
          data: $.param({'name':'ResultOfDesign','data':JSON.stringify($scope.jsonData)}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'},
        }).
        success(function(response) {
            $scope.codeStatus = response.data;
            $window.location.href = 'downloadDesign.php';
        }).
        error(function(response) {
            $scope.codeStatus = response || "Request failed";
        });
    };
});