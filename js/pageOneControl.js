var app = angular.module("nexp", ['LocalStorageModule']);

app.config(function(localStorageServiceProvider){
  localStorageServiceProvider
    .setPrefix('nexp')
    .setStorageType('localStorage')
    //.setStorageType('sessionStorage')
    .setStorageCookieDomain('example.com')
    .setNotify(true, true);
});

app.controller('pageOneControl', function($scope, $http, localStorageService){
	//console.log(localStorageService.get('localStorageDemo'));

	if (localStorageService.getStorageType().indexOf('session') >= 0) {
      console.log('StorageType: Session storage');
    }

    if (!localStorageService.isSupported) {
      console.log('StorageType: Cookie');
    }

    localStorageService.bind($scope, 'jsonData');
    //$scope.jsonData = localStorageService.get('jsonData');
    //console.log($scope.jsonData);
    console.log($scope.jsonData.design_guide.research_question.general_question);

    //$scope.selectedItemTwo = $scope.jsonData.design_guide.research_question.hypothesis.compare_solutions[0];

    $scope.clickMinusFunction = function(selectID) {
    	console.log(selectID);
		var hypothesis = $scope.jsonData.design_guide.research_question.hypothesis;
		console.log(hypothesis.compare_solutions);
		switch(selectID){
			case 'selectOne':
			case 'selectTwo':
				var removedIndex = hypothesis.compare_solutions.indexOf($scope.selectedItemTwo);
				hypothesis.compare_solutions.splice(removedIndex,1);
				break;
			case 'selectThree':
				hypothesis.tasks.splice(selectID.selectedIndex,1);
				break;
			case 'selectFour':
				hypothesis.contexts.splice(selectID.selectedIndex,1);
				break;
			case 'selectFive':
				hypothesis.measures.splice(selectID.selectedIndex,1);
				break;
			default:
		}
	    //selectID.remove(selectID.selectedIndex);
	};
	function saveChanges(selectID, inputID){
		if(inputID.value == "") return;
		var tmp = inputID.value;
		var option = document.createElement("option");
		option.text = tmp;
		selectID.add(option);
		inputID.value = "";
	}
});

