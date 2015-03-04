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
    var IVgroups = $scope.jsonData.design_guide.variables.independent_variable;

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
          levels: [],
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
      // var removedIndex = IVgroups.indexOf(group);
      // console.log(removedIndex);
      // IVgroups.splice(removedIndex,1);
    };

    $scope.saveGroups = function() {
      for (var i = $scope.groups.length - 1; i >= 0; i--) {
        var group = $scope.groups[i];
        group.sortOrder = i + 1;
        group.save();
      }
    };

    $scope.addCategory = function(group) {
      if (!group.newCategoryName || group.newCategoryName.length === 0) {
        return;
      }
      group.categories.push({
        name: group.newCategoryName,
        sortOrder: group.categories.length,
        type: "category"
      });
      group.newCategoryName = '';
      group.save();
    };

    $scope.removeCategory = function(group, category) {
      if (window.confirm('Are you sure to remove this category?')) {
        var index = group.categories.indexOf(category);
        if (index > -1) {
          group.categories.splice(index, 1)[0];
        }
        group.save();
      }
    };

    $scope.options = {
      accept: function(sourceNode, destNodes, destIndex) {
        var data = sourceNode.$modelValue;
        var destType = destNodes.$element.attr('data-type');
        return (data.type == destType); // only accept the same type
      },
      dropped: function(event) {
        console.log(event);
        var sourceNode = event.source.nodeScope;
        var destNodes = event.dest.nodesScope;
        // update changes to server
        if (destNodes.isParent(sourceNode)
          && destNodes.$element.attr('data-type') == 'category') { // If it moves in the same group, then only update group
          var group = destNodes.$nodeScope.$modelValue;
          group.save();
        } else { // save all
          $scope.saveGroups();
        }
      },
      beforeDrop: function(event) {
        if (!window.confirm('Are you sure you want to drop it here?')) {
          event.source.nodeScope.$$apply = false;
        }
      }
    };
});