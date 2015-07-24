var app = angular.module("nexp", ['LocalStorageModule','ui.tree']);

app.config(function(localStorageServiceProvider){
  localStorageServiceProvider
    .setPrefix('nexp')
    .setStorageType('localStorage')
    //.setStorageType('sessionStorage')
    .setStorageCookieDomain('example.com')
    .setNotify(true, true);
});

app.controller('pageTwoControl',function($scope, $http, localStorageService){
	  if (localStorageService.getStorageType().indexOf('session') >= 0) {
      console.log('StorageType: Session storage');
    }

    if (!localStorageService.isSupported) {
      console.log('StorageType: Cookie');
    }

    localStorageService.bind($scope, 'jsonData');
    localStorageService.bind($scope, 'flagOne');

    var IVgroups = $scope.jsonData.design_guide.variables.independent_variable;
    var DVgroups = $scope.jsonData.design_guide.variables.dependent_variable;

    $scope.Automation = function(){
      $scope.flagOne = false;

      var HYgroups = $scope.jsonData.design_guide.research_question.hypothesis;
      if(HYgroups.main_solutions.length != 0 || HYgroups.compare_solutions.length != 0){
        var tmp = {
          name: "Techniques",
          subject_design: "Within",
          levels: [
            ],
          counter_balance: "FullyCounterBalancing",
          type: "group"
        };

        HYgroups.main_solutions.forEach(function(item){
          tmp.levels.push({
              name: item.toString(),
              type: "category"
          });
        });

        HYgroups.compare_solutions.forEach(function(item){
          tmp.levels.push({
              name: item.toString(),
              type: "category"
          });
        });

        IVgroups.push(tmp);
      }

      if(HYgroups.tasks.length != 0){

        HYgroups.tasks.forEach(function(item){
          // tmp.levels.push({
          //     name: item.toString(),
          //     type: "category"
          // });
          var tmp = {
            name: item.toString(),
            subject_design: "Within",
            levels: [
              ],
            counter_balance: "FullyCounterBalancing",
            type: "group"
          };

          IVgroups.push(tmp);
        });
      }
      if(HYgroups.contexts.length != 0){

        HYgroups.contexts.forEach(function(item){
          var tmp = {
            name: item.toString(),
            subject_design: "Within",
            levels: [
              ],
            counter_balance: "FullyCounterBalancing",
            type: "group"
          };

          IVgroups.push(tmp);
          // tmp.levels.push({
          //     name: item.toString(),
          //     type: "category"
          // });
        });
      }
      if(HYgroups.measures.length != 0){
        HYgroups.measures.forEach(function(item){
          DVgroups.push({
            name: item.toString(),
            type: "DVgroup"
          });
        });
      }
    };

    if($scope.flagOne === 'true'){
      $scope.Automation();
      console.log("First enter the Automation");
    }

    $scope.addGroup = function() {
      // if ($scope.groups.length > 10) {
      //   window.alert('You can\'t add more than 10 groups!');
      //   return;
      // }
      var groupName = document.getElementById("groupName").value;
      if (groupName.length > 0) {
        IVgroups.push({
          name: groupName,
          subject_design: "Within",
          counter_balance: "FullyCounterBalancing",
          levels: [],
          type: "group"
        });
        document.getElementById("groupName").value = '';
      }
    };

    $scope.editGroup = function(group) {
      group.editing = true;
    };

    $scope.cancelEditingGroup = function(group) {
      group.editing = false;
    };

    $scope.saveGroup = function(group) {
      group.editing = false;
    };

    $scope.removeGroup = function(group) {
      // if (window.confirm('Are you sure to remove this group?')) {
      //   group.destroy();
      // }
      var removedIndex = IVgroups.indexOf(group);
      console.log(removedIndex);
      IVgroups.splice(removedIndex,1);
    };

    $scope.removeDVGroup = function(group){
      var removedIndex = DVgroups.indexOf(group);
      console.log(removedIndex);
      DVgroups.splice(removedIndex,1);
    };

    $scope.addCategory = function(group) {
      if (!group.newCategoryName || group.newCategoryName.length === 0) {
        return;
      }
      group.levels.push({
        name: group.newCategoryName,
        type: "category"
      });
      group.newCategoryName = '';
    };

    $scope.removeCategory = function(group, category) {
      var removedIndex = group.levels.indexOf(category);
      if (removedIndex > -1) {
        group.levels.splice(removedIndex, 1);
      }
    };

    $scope.editCategory = function(category){
      category.editing = true;
    };

    $scope.saveCategory = function(category){
      category.editing = false;
    };

    $scope.cancelEditingCategory = function(category){
      category.editing = false;
    };

    $scope.addGrouptoDV = function(){
      var groupName = document.getElementById("DVgroupName").value;
      if (groupName.length > 0) {
        DVgroups.push({
          name: groupName,
          type: "DVgroup"
        });
        document.getElementById("DVgroupName").value = '';
      }      
    };

    $scope.options = {
      accept: function(sourceNode, destNodes, destIndex) {
        // console.log("accept");
        var data = sourceNode.$modelValue.type;
        var destType = destNodes.$element.attr('data-type');
        //console.log(sourceNode.$modelValue.type == destType);
        return (data == destType); // only accept the same type
        //return true;
      },
      // dropped: function(event) {
      //   console.log(event);
      //   // var sourceNode = event.source.nodeScope;
      //   // var destNodes = event.dest.nodesScope;
      //   // // update changes to server
      //   // if (destNodes.isParent(sourceNode)
      //   //   && destNodes.$element.attr('data-type') == 'category') { // If it moves in the same group, then only update group
      //   //   var group = destNodes.$nodeScope.$modelValue;
      //   //   //group.save();
      //   // } else { // save all
      //   //   //$scope.saveGroups();
      //   // }
      // },
      beforeDrop: function(event) {
        //if (!window.confirm('Are you sure you want to drop it here?')) {
        //event.source.nodeScope.$$apply = true;
        //}
      }
    };
});