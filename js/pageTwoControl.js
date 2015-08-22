var app = angular.module("nexp", ['LocalStorageModule','ui.tree']);

app.config(function(localStorageServiceProvider){
  localStorageServiceProvider
    .setPrefix('nexp')
    .setStorageType('localStorage')
    //.setStorageType('sessionStorage')
    .setStorageCookieDomain('example.com')
    .setNotify(true, true);
});
// app.filter('filterSolution',function(){
//   return function(group){
//     return (group.pid == 0);
//   };
// });
// app.filter('filterNonSolution',function(group){
//   return (group.pid != 0);
// });
app.controller('pageTwoControl',function($scope, $http, localStorageService){
	  if (localStorageService.getStorageType().indexOf('session') >= 0) {
      console.log('StorageType: Session storage');
    }

    if (!localStorageService.isSupported) {
      console.log('StorageType: Cookie');
    }

    localStorageService.bind($scope, 'jsonData');
    //localStorageService.bind($scope, 'flagOne');

    var IVgroups = $scope.jsonData.design_guide.variables.independent_variable;
    var DVgroups = $scope.jsonData.design_guide.variables.dependent_variable;
    var hypothesis = $scope.jsonData.design_guide.research_question.hypothesis;

    $scope.filterSolution = function(group){
      return (group.pid == 0);
    };

    $scope.addGroup = function() {
      var groupName = document.getElementById("groupName").value;
      if (groupName.length > 0) {
        IVgroups.push({
          name: groupName,
          subject_design: "Within",
          counter_balance: "FullyCounterBalancing",
          levels: [],
          type: "group",
          pid: $scope.jsonData.parameter.pid
        });

        hypothesis.contexts.push({
          name: groupName,
          pid: $scope.jsonData.parameter.pid
        });

        $scope.jsonData.parameter.pid++;
        document.getElementById("groupName").value = '';
      }
    };

    $scope.editGroup = function(group) {
      group.editing = true;
      group.preName = group.name;
    };

    $scope.cancelEditingGroup = function(group) {
      group.editing = false;
      group.name = group.preName;
    };

    $scope.saveGroup = function(group) {
      group.editing = false;
      group.preName = group.name;
      if(group.pid != 0){
        hypothesis.tasks.forEach(function(item, index){
          if(item.pid == group.pid){
            item.name = group.name;
          }
        });
        hypothesis.contexts.forEach(function(item, index){
          if(item.pid == group.pid){
            item.name = group.name;
          }
        });
        hypothesis.measures.forEach(function(item, index){
          if(item.pid == group.pid){
            item.name = group.name;
          }
        });                
      }
    };

    $scope.removeGroup = function(group) {
      var removedIndex = IVgroups.indexOf(group);
      console.log(removedIndex);
      IVgroups.splice(removedIndex,1);

      hypothesis.tasks.forEach(function(item,index){
        if(item.pid == group.pid){
          hypothesis.tasks.splice(index,1);
        }
      });
      hypothesis.contexts.forEach(function(item,index){
        if(item.pid == group.pid){
          hypothesis.contexts.splice(index,1);
        }
      });
    };

    $scope.removeDVGroup = function(group){
      var removedIndex = DVgroups.indexOf(group);
      console.log(removedIndex);
      DVgroups.splice(removedIndex,1);

      hypothesis.measures.forEach(function(item,index){
        if(item.pid == group.pid){
          hypothesis.measures.splice(index,1);
        }
      });
    };

    $scope.addCategory = function(group) {
      if (!group.newCategoryName || group.newCategoryName.length === 0) {
        return;
      }
      group.levels.push({
        name: group.newCategoryName,
        type: "category",
        description: "",
        pid: $scope.jsonData.parameter.pid
      });

      if(group.pid == 0){
        hypothesis.compare_solutions.push({
          name: group.newCategoryName,
          pid: $scope.jsonData.parameter.pid
        });        
      }
      $scope.jsonData.parameter.pid++;
      group.newCategoryName = '';
    };

    $scope.removeCategory = function(group, category) {
      var removedIndex = group.levels.indexOf(category);
      if (removedIndex > -1) {
        group.levels.splice(removedIndex, 1);
        if(group.pid == 0){
          hypothesis.main_solutions.forEach(function(item,index){
            if(item.pid == category.pid){
              hypothesis.main_solutions.splice(index,1);
            }
          });

          hypothesis.ComSolutions.forEach(function(item,index){
            if(item.pid == category.pid){
              hypothesis.ComSolutions.splice(index,1);
            }
          });
        }        
      }
    };

    $scope.editCategory = function(category){
      category.editing = true;
      category.preName = category.name;
    };

    $scope.saveCategory = function(group, category){
      category.editing = false;
      category.preName = category.name;

      if(group.pid == 0){
        hypothesis.main_solutions.forEach(function(item,index){
          if(item.pid == category.pid){
            item.name = category.name;
          }
        });

        hypothesis.compare_solutions.forEach(function(item,index){
          if(item.pid == category.pid){
            item.name = category.name;
          }
        });
      }
    };

    $scope.cancelEditingCategory = function(category){
      category.editing = false;
      category.name = category.preName;
    };

    $scope.addGrouptoDV = function(){
      var groupName = document.getElementById("DVgroupName").value;
      if (groupName.length > 0) {
        DVgroups.push({
          name: groupName,
          type: "DVgroup",
          description: "",
          pid: $scope.jsonData.parameter.pid
        });

        hypothesis.measures.push({
          name: groupName,
          pid:$scope.jsonData.parameter.pid
        });

        $scope.jsonData.parameter.pid++;  
        document.getElementById("DVgroupName").value = '';
      }      
    };

    $scope.options = {
      accept: function(sourceNode, destNodes, destIndex) {
        var data = sourceNode.$modelValue.type;
        var destType = destNodes.$element.attr('data-type');
        // console.log(sourceNode.$modelValue.type);
        // console.log('destType:'+destType);
        return (data == destType); // only accept the same type
      },
      beforeDrop: function(event) {
        //if (!window.confirm('Are you sure you want to drop it here?')) {
        //event.source.nodeScope.$$apply = true;
        //}
      }
    };
});