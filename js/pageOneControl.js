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

    var IVgroups = $scope.jsonData.design_guide.variables.independent_variable;
    var DVgroups = $scope.jsonData.design_guide.variables.dependent_variable;
	var hypothesis = $scope.jsonData.design_guide.research_question.hypothesis;
	//var pid = $scope.jsonData.parameter.pid;

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

    $scope.addItems = function(tmp) {
      // if ($scope.groups.length > 10) {
      //   window.alert('You can\'t add more than 10 groups!');
      //   return;
      // }
	switch(tmp){
		case 'MainSolutions':
		  var groupName = document.getElementById("MainSolutions").value;
		  if (groupName.length > 0) {

		    hypothesis.main_solutions.push({
		      name: groupName,
		      pid: $scope.jsonData.parameter.pid
		    });

		    IVgroups.forEach(function(item,index){
      			if(item.pid == 0){
		          item.levels.push({
		              name: groupName,
		              type: "category",
		              pid: $scope.jsonData.parameter.pid
		          });      				
      			}
    		});
    		$scope.jsonData.parameter.pid++;
		    document.getElementById("MainSolutions").value = '';
		  }

		  break;

		case 'ComSolutions':
		  var groupName = document.getElementById("ComSolutions").value;
		  if (groupName.length > 0) {
		    hypothesis.compare_solutions.push({
		      name: groupName,
		      pid: $scope.jsonData.parameter.pid
		    });

		   	IVgroups.forEach(function(item,index){
      			if(item.pid == 0){
		          item.levels.push({
		              name: groupName,
		              type: "category",
		              pid: $scope.jsonData.parameter.pid
		          });      				
      			}
    		});
    		$scope.jsonData.parameter.pid++;
		    document.getElementById("ComSolutions").value = '';
		  }
		  break;

		case 'Tasks':
		  var groupName = document.getElementById("Tasks").value;
		  if (groupName.length > 0) {
		    hypothesis.tasks.push({
		      name: groupName,
		      pid: $scope.jsonData.parameter.pid
		    });
          var tmp = {
            name: groupName,
            subject_design: "Within",
            levels: [
              ],
            counter_balance: "FullyCounterBalancing",
            type: "group",
            pid: $scope.jsonData.parameter.pid
          };

          IVgroups.push(tmp);
          $scope.jsonData.parameter.pid++;	    
		  document.getElementById("Tasks").value = '';
		  }
		  break;	

		case 'Contexts':
		  var groupName = document.getElementById("Contexts").value;
		  if (groupName.length > 0) {
		    hypothesis.contexts.push({
		      name: groupName,
		      pid: $scope.jsonData.parameter.pid
		    });

          var tmp = {
            name: groupName,
            subject_design: "Within",
            levels: [
              ],
            counter_balance: "FullyCounterBalancing",
            type: "group",
            pid: $scope.jsonData.parameter.pid
          };

          IVgroups.push(tmp);
          $scope.jsonData.parameter.pid++;		    
		  document.getElementById("Contexts").value = '';
		  }
		  break;

		case 'Measures':
		  var groupName = document.getElementById("Measures").value;
		  if (groupName.length > 0) {
		    hypothesis.measures.push({
		      name: groupName,
		      pid:$scope.jsonData.parameter.pid
		    });

          var tmp = {
            name: groupName,
            subject_design: "Within",
            levels: [
              ],
            counter_balance: "FullyCounterBalancing",
            type: "group",
            pid: $scope.jsonData.parameter.pid
          };

          DVgroups.push(tmp);
          $scope.jsonData.parameter.pid++;		    
		  document.getElementById("Measures").value = '';
		  }
		  break;

		case 'targetPopulation':
		  var groupName = document.getElementById("targetPopulation").value;
		  if (groupName.length > 0) {
		    hypothesis.target_population.push({
		      name: groupName,
		    });
		    document.getElementById("targetPopulation").value = '';
		  }
		  break;	  		  	  		
		default:
	}
    };
    $scope.editItem = function(group) {
      group.editing = true;
    };

    $scope.cancelEditingItem = function(group) {
      group.editing = false;
    };

    $scope.saveItem = function(group) {
      IVgroups.forEach(function(item,index){
      	if(item.pid == 0){
      		item.levels.forEach(function(subItem,subIndex){
      			if(subItem.pid == group.pid)
      				subItem.name = group.name;
      		});
      	}
      	else if(item.pid == group.pid){
      		item.name = group.name;
      	}
      	else{}
      });

      DVgroups.forEach(function(item,index){
      	if(item.pid == group.pid){
      		item.name = group.name;
      	}
      });
      group.editing = false;
    };

    $scope.removeItem = function(tmp, group) {
      // if (window.confirm('Are you sure to remove this group?')) {
      //   group.destroy();
      // }
		switch(tmp){
			case 'MainSolutions':
			    var removedIndex = hypothesis.main_solutions.indexOf(group);
      			hypothesis.main_solutions.splice(removedIndex,1);

      			IVgroups.forEach(function(item,index){
	      			if(item.pid == 0){
			          item.levels.forEach(function(subItem,subIndex){
			          	if(subItem.pid == group.pid){
			          		item.levels.splice(subIndex,1);
			          	}
			          });     				
	      			}
    			});
				break;

			case 'ComSolutions':
			    var removedIndex = hypothesis.compare_solutions.indexOf(group);
      			hypothesis.compare_solutions.splice(removedIndex,1);

      			IVgroups.forEach(function(item,index){
	      			if(item.pid == 0){
			          item.levels.forEach(function(subItem,subIndex){
			          	if(subItem.pid == group.pid){
			          		item.levels.splice(subIndex,1);
			          	}
			          });     				
	      			}
    			});
				break;

			case 'Tasks':
			    var removedIndex = hypothesis.tasks.indexOf(group);
      			hypothesis.tasks.splice(removedIndex,1);

      			IVgroups.forEach(function(item,index){
		          	if(item.pid == group.pid){
		          		IVgroups.splice(index,1);
		          	}	
    			});
				break;

			case 'Contexts':
			    var removedIndex = hypothesis.contexts.indexOf(group);
      			hypothesis.contexts.splice(removedIndex,1);

      			IVgroups.forEach(function(item,index){
		          	if(item.pid == group.pid){
		          		IVgroups.splice(index,1);
		          	}	
    			});
				break;

			case 'Measures':
			    var removedIndex = hypothesis.measures.indexOf(group);
      			hypothesis.measures.splice(removedIndex,1);

      			DVgroups.forEach(function(item,index){
		          	if(item.pid == group.pid){
		          		DVgroups.splice(index,1);
		          	}	
    			});
				break;

			case 'targetPopulation':
			    var removedIndex = hypothesis.target_population.indexOf(group);
      			hypothesis.target_population.splice(removedIndex,1);
				break;															
			default:
		}
    };

    $scope.showExample = function(){
    	// need to add to IV&DV as well
    	hypothesis.main_solutions = [];
    	hypothesis.main_solutions.push({
    		name: 'optimal keyboard layout'
    	});
    	hypothesis.compare_solutions = [];
    	hypothesis.compare_solutions.push({
    		name: 'qwerty keyboard layout'
    	});
    	hypothesis.tasks = [];
    	hypothesis.tasks.push({
    		name: 'Type \'the quick brown fox jumps over the lazy dog\''
    	});
    	hypothesis.contexts = [];
    	hypothesis.contexts.push({
    		name: 'Different devices'
    	},{
    		name: 'Different screen size'
    	});
    	hypothesis.measures = [];
    	hypothesis.measures.push({
    		name: 'Speed'
    	},{
    		name: 'Accuracy'
    	},{
    		name: 'Learning cost'
    	});
    	hypothesis.target_population = [];
    	hypothesis.target_population.push({
    		name: 'Computer users'
    	});
    };

    $scope.reset = function(){
    	hypothesis.main_solutions = [];
    	hypothesis.compare_solutions = [];
    	hypothesis.tasks = [];
    	hypothesis.contexts = [];
    	hypothesis.measures = [];
    	hypothesis.target_population = [];

    };
 //    $scope.clickMinusFunction = function(selectID) {
 //    	console.log(selectID);
	// 	var hypothesis = $scope.jsonData.design_guide.research_question.hypothesis;
	// 	switch(selectID){
	// 		case 'selectOne':
	// 			var removedIndex = hypothesis.main_solutions.indexOf(($scope.selectedItemOne)?$scope.selectedItemOne.toString():null);
	// 			console.log(hypothesis.main_solutions[0]);
	// 			console.log($scope.selectedItemOne);
	// 			if(removedIndex >= 0){
	// 				hypothesis.main_solutions.splice(removedIndex,1);
	// 			}
	// 			break;
	// 		case 'selectTwo':
	// 			console.log($scope.selectedItemTwo);
	// 			var removedIndex = hypothesis.compare_solutions.indexOf(($scope.selectedItemTwo)?$scope.selectedItemTwo.toString():null);
	// 			if(removedIndex >= 0){
	// 				hypothesis.compare_solutions.splice(removedIndex,1);
	// 			}
	// 			break;
	// 		case 'selectThree':
	// 			var removedIndex = hypothesis.tasks.indexOf(($scope.selectedItemThree)?$scope.selectedItemThree.toString():null);
	// 			if(removedIndex >= 0){
	// 				hypothesis.tasks.splice(removedIndex,1);
	// 			}
	// 			break;
	// 		case 'selectFour':
	// 			var removedIndex = hypothesis.contexts.indexOf(($scope.selectedItemFour)?$scope.selectedItemFour.toString():null);
	// 			if(removedIndex >= 0){
	// 				hypothesis.contexts.splice(removedIndex,1);
	// 			}
	// 			break;
	// 		case 'selectFive':
	// 			var removedIndex = hypothesis.measures.indexOf(($scope.selectedItemFive)?$scope.selectedItemFive.toString():null);
	// 			if(removedIndex >= 0){
	// 				hypothesis.measures.splice(removedIndex,1);
	// 			}
	// 			break;
	// 		default:
	// 	}
	//     //selectID.remove(selectID.selectedIndex);
	// };
	// $scope.saveChanges = function (selectID){
	// 	if($scope.addOption == null || $scope.addOption == "") return;

	// 	var hypothesis = $scope.jsonData.design_guide.research_question.hypothesis;
	// 	switch(selectID){
	// 		case 'selectOne':
	// 			hypothesis.main_solutions.push($scope.addOption);
	// 			break;
	// 		case 'selectTwo':
	// 			hypothesis.compare_solutions.push($scope.addOption);
	// 			break;
	// 		case 'selectThree':
	// 			hypothesis.tasks.push($scope.addOption);
	// 			break;
	// 		case 'selectFour':
	// 			hypothesis.contexts.push($scope.addOption);
	// 			break;
	// 		case 'selectFive':
	// 			hypothesis.measures.push($scope.addOption);
	// 			break;
	// 		default:
	// 	}

	// 	$scope.addOption = null;
	// 	// var tmp = inputID.value;
	// 	// var option = document.createElement("option");
	// 	// option.text = tmp;
	// 	// selectID.add(option);
	// 	// inputID.value = "";
	// };
});

