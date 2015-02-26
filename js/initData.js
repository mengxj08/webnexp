var app = angular.module("nexp", ['LocalStorageModule']);

app.config(function(localStorageServiceProvider){
  localStorageServiceProvider
    .setPrefix('nexp')
    .setStorageType('localStorage')
    .setStorageCookieDomain('example.com')
    .setNotify(true, true);
});

app.controller('initData', function($scope, $http, localStorageService){
	localStorageService.clearAll();

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

function createJsonData(){
	var jsonData = {"design_guide":{"research_question":{"general_question":"What is the interactive effect of density & the number of dimension for PCP & SCP-standard?","experiment_title":"PCP vs. SCP","experiment_description":"Xiaojun","experiment_conductor":"There seems to be a Density & Number of Dimension Trade-off between PCP & SCP-common. I try to figure out the specific interactive effect here.","hypothesis":{"main_solution":"SCP","compare_solutions":{"compare_solution":"PCP"},"tasks":{"task":"Density"},"contexts":{"context":"Number of dimension"},"measures":{"measure":["Time cost","Accuracy"]},"target_population":""}},"variables":{"independent_variable":[{"name":"Technique","subject_design":"Within","levels":{"level":[{"name":"SCP"},{"name":"PCP"}]},"counter_balance":"FullyCounterBalancing"},{"name":"Density","subject_design":"Within","levels":{"level":[{"name":"4D"},{"name":"6D"}]},"counter_balance":"FullyCounterBalancing"},{"name":"Number of dimension","subject_design":"Within","levels":{"level":[{"name":"20"},{"name":"40"}]},"counter_balance":"FullyCounterBalancing"}],"dependent_variable":[{"name":"Time cost"},{"name":"Accuracy"}]},"arrangement":{"min_number":"8","actual_number":"16","fee_per_participant":"10","trial":"3","time_per_trial":"200","block":"2","participants":""}}};
	return JSON.parse(jsonData);
}