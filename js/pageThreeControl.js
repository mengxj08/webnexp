var app = angular.module("nexp", ['LocalStorageModule']);

app.config(function(localStorageServiceProvider){
  localStorageServiceProvider
    .setPrefix('nexp')
    .setStorageType('localStorage')
    //.setStorageType('sessionStorage')
    .setStorageCookieDomain('example.com')
    .setNotify(true, true);
});

app.controller('pageThreeControl',function($scope, $http, localStorageService){
	if (localStorageService.getStorageType().indexOf('session') >= 0) {
      console.log('StorageType: Session storage');
    }

    if (!localStorageService.isSupported) {
      console.log('StorageType: Cookie');
    }

    localStorageService.bind($scope, 'jsonData');	
    console.log($scope.jsonData.design_guide.variables.independent_variable.length);
    var IVgroups = $scope.jsonData.design_guide.variables.independent_variable;

    $scope.removeNoLevels = function(){
        for(var i = 0; i < IVgroups.length; i++){
            if(IVgroups[i].levels.length == 0){
                IVgroups.splice(i,1);
                i--;
            }
        }
    };
    $scope.removeNoLevels();

    $scope.clickMinusFunction = function(IDV, selectedlevel){
    	if(IDV && selectedlevel){
    		var index = IVgroups.indexOf(IDV);
    		if(index > -1)
    		{
    			//console.log("index:"+index);
    			IVgroups[index].levels.forEach(function(element,indexElement){
    				if(element.name == selectedlevel.toString()){
    					IVgroups[index].levels.splice(indexElement,1);
    				}
    			});
    			//var indexLevel = IVgroups[index].levels.indexOf(selectedlevel.toString());
    			//console.log(selectedlevel);
    			//console.log(IVgroups[index].levels);
    		}
    		
    	}
    };
    $scope.passValuetoModel = function(IDV){
    	$scope.clickedItem = IDV;
    	console.log("123");
    };
    $scope.saveChanges = function(IDV){
    	var groupName = document.getElementById("inputOne").value;
    	if($scope.clickedItem && groupName.length > 0){
	    	var index = IVgroups.indexOf($scope.clickedItem);
	    	IVgroups[index].levels.push({
	          name: groupName,
	          type: "category",
	        });
	        document.getElementById("inputOne").value = '';
    	}
    };
});