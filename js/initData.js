var app = angular.module("nexp", ['LocalStorageModule','angularFileUpload']);

app.config(function(localStorageServiceProvider){
  localStorageServiceProvider
    .setPrefix('nexp')
    .setStorageType('localStorage')
    //.setStorageType('sessionStorage')
    .setStorageCookieDomain('example.com')
    .setNotify(true, true);
});

app.controller('initData', function($scope, $http, $window, localStorageService,FileUploader){
	localStorageService.clearAll();

	if (localStorageService.getStorageType().indexOf('session') >= 0) {
      console.log('StorageType: Session storage');
    }

    if (!localStorageService.isSupported) {
      console.log('StorageType: Cookie');
    }

    $scope.clearSession = function(){
      $http({
          method: 'post',
          url: 'SaveDataToCookies.php',
          data: $.param({'name':'clear','data':'ResultOfArrangement'}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'},
        }).
        success(function(response) {
            $scope.codeStatus = response.data;
            console.log("Unset successfully");
        }).
        error(function(response) {
            $scope.codeStatus = response || "Request failed";
        });
    };        

    $scope.clearSession();

    $scope.ReadLocalJsonFile = function(){
        //$scope.data = "data/data.json";
        localStorageService.set('flagOne', true);
        $scope.data = "data/rawData.json";
        $http.get($scope.data).success(function (data){
        localStorageService.set('jsonData', data);
        localStorageService.bind($scope, 'jsonData');
        $scope.setPrimaryFactor();
        console.log($scope.jsonData.design_guide.variables.independent_variable.length);
      });     
    };

    $scope.setPrimaryFactor = function(){
        var IVgroups = $scope.jsonData.design_guide.variables.independent_variable;
        var flag = true;
        IVgroups.forEach(function(item,index){
          if(item.pid == 0)
            flag = false;
        });

        if(flag){
            var tmp = {
              name: "Techniques",
              subject_design: "Within",
              levels: [
                ],
              counter_balance: "FullyCounterBalancing",
              type: "group",
              pid: 0
            };
            IVgroups.push(tmp);
        }
    };

    $scope.ReadLocalJsonFile();

    var uploader = $scope.uploader = new FileUploader({
        url: 'upload.php',
        autoUpload: true
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        //console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        //console.info('onAfterAddingFile', fileItem);
    };
    // uploader.onAfterAddingAll = function(addedFileItems) {
    //     console.info('onAfterAddingAll', addedFileItems);
    // };
    // uploader.onBeforeUploadItem = function(item) {
    //     console.info('onBeforeUploadItem', item);
    // };
    // uploader.onProgressItem = function(fileItem, progress) {
    //     console.info('onProgressItem', fileItem, progress);
    // };
    // uploader.onProgressAll = function(progress) {
    //     console.info('onProgressAll', progress);
    // };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        //console.info('onSuccessItem', fileItem, response, status, headers);
        localStorageService.set('flagOne', false);
        var data = angular.fromJson(response.answer);
        localStorageService.set('jsonData', data);
        localStorageService.bind($scope, 'jsonData');
        console.log($scope.jsonData.design_guide.variables.dependent_variable.length);
        $window.location.href = 'guidedesign.html';

    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    // uploader.onCancelItem = function(fileItem, response, status, headers) {
    //     console.info('onCancelItem', fileItem, response, status, headers);
    // };
    // uploader.onCompleteItem = function(fileItem, response, status, headers) {
    //     console.info('onCompleteItem', fileItem, response, status, headers);
    // };
    // uploader.onCompleteAll = function() {
    //     console.info('onCompleteAll');
    // };

});