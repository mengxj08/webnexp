var app = angular.module("nexp", ['LocalStorageModule']);

app.config(function(localStorageServiceProvider){
  localStorageServiceProvider
    .setPrefix('nexp')
    .setStorageType('localStorage')
    //.setStorageType('sessionStorage')
    .setStorageCookieDomain('example.com')
    .setNotify(true, true);
});

app.controller('pageFourControl',function($scope, $http, localStorageService){
	if (localStorageService.getStorageType().indexOf('session') >= 0) {
      console.log('StorageType: Session storage');
    }

    if (!localStorageService.isSupported) {
      console.log('StorageType: Cookie');
    }

    localStorageService.bind($scope, 'jsonData');	
    console.log($scope.jsonData.design_guide.variables.independent_variable.length);
    var arrangement = $scope.jsonData.design_guide.arrangement;

    $scope.between = "Between";
    $scope.within = "Within";
    $scope.fullyCounterBalancing = "FullyCounterBalancing";
    $scope.latinSquare = "LatinSquare";
    $scope.noCounterBalancing = "NoCounterBalancing";
    
    $scope.showDraw = function(){
      $scope.generate = true;
      $scope.GenerateSimulation();
      //draw();
    };

    $scope.GenerateSimulation = function(){
      $scope.idvBetween = new Array();
      $scope.idvWithin = new Array();
      $scope.arrangement = new Array();
      $scope.individual = new Array();
      $scope.betweenArrangement = new Array();
      $scope.numberOfParticipants = 1;
      $scope.numberOfConditions = 1;
      $scope.numberOfBetweenArrangement = 1;
      $scope.jsonData.design_guide.variables.independent_variable.forEach(function(idv){
        switch(idv.subject_design){
          case $scope.between:
            $scope.idvBetween.push(idv);
            $scope.numberOfBetweenArrangement *= idv.levels.length;
            break;
          case $scope.within:
            $scope.idvWithin.push(idv);
            break;
        }
      });

      $scope.GenerateOverallArrangment();
      //console.log($scope.arrangement);
      $scope.GenerateIndividualArrangment();
      //console.log($scope.individual);
      $scope.GenerateBetweenArrangment();
      $scope.WriteToJson();
      console.log($scope.writeToJson);
    };

    $scope.GenerateOverallArrangment = function(){
      $scope.idvWithin.forEach(function(idv){
        var levelsName = new Array();
        idv.levels.forEach(function(level){
          levelsName.push(level.name);
        });

        switch(idv.counter_balance){
          case $scope.fullyCounterBalancing:
            var result = levelsName.reduce(function permute(res, item, key, arr) {
                         return res.concat(arr.length > 1 && arr.slice(0, key).concat(arr.slice(key + 1)).reduce(permute, []).map(function(perm) { return [item].concat(perm); }) || item);}, []);
            $scope.arrangement.push(result);
            break;
          case $scope.latinSquare:
            var result = new Array();
            for(var i = 0; i < levelsName.length; i++){
              var tmp = new Array();
              var j = i;
              for(var count = 0; count < levelsName.length; count++){
                tmp.push(levelsName[(j+levelsName.length)%levelsName.length]);
                j++;
              }
              result.push(tmp);
            }
            $scope.arrangement.push(result);
            break;
          case $scope.noCounterBalancing:
            var result = new Array();
            result.push(levelsName);
            $scope.arrangement.push(result);
            break;
        }
      });
    };

    $scope.GenerateIndividualArrangment = function(){
      $scope.arrangement.forEach(function(idv){
        $scope.numberOfParticipants *= idv.length;
      });

      $scope.idvWithin.forEach(function(idv){
        $scope.numberOfConditions *= idv.levels.length;
      });

      for(var i=0; i < $scope.numberOfParticipants; i++){
        var participants = new Array();
        var total = $scope.numberOfParticipants;
        var tmp = i;

        var index = new Array($scope.arrangement.length);

        for(var j=0; j<$scope.arrangement.length; j++){
          total /= $scope.arrangement[j].length;
          index[j] = parseInt(tmp/total);
          tmp -= index[j]*total;
        }
        console.log("index:"+index);
        for(var k=0; k < $scope.numberOfConditions; k++){
          var condition = new Array();
          var tmpK = k;
          var totalConditions = $scope.numberOfConditions;
          for(var m=0; m<$scope.arrangement.length; m++){
            totalConditions /= parseInt($scope.idvWithin[m].levels.length);
            var n = parseInt(tmpK / totalConditions);
            condition.push($scope.arrangement[m][index[m]][n]);
            tmpK -= n*totalConditions;
          }
          participants.push(condition);
        }

        $scope.individual.push(participants);
      }
    };

    $scope.GenerateBetweenArrangment = function(){
      if($scope.idvBetween.length == 0) return;

      for(var i=0; i<$scope.numberOfBetweenArrangement; i++){
        var tmpArrangement = new Array();

        var tmpI = i;
        var totalArrangement = numberOfBetweenArrangement;

        for(var m=0; m < $scope.idvBetween.length; m++){
          totalArrangement /= idvBetween[m].levels.length;
          var n = tmpI / totalArrangement;
          tmpArrangement.push(idvBetween[m].levels[n].name);
          tmpI -= n*totalArrangement;
        }

        $scope.betweenArrangement.push(tmpArrangement);
      }
    };
    $scope.WrapperNameLine = function(example, mode){
      switch(mode){
        case 0:
          return "\"name\": \"" + example.toString() + "\",";
        case 1:
          return "{\"name\": \"" + example.toString() + "\"}";
        default:
          return example.toString();
      }
    };
    $scope.WriteToJson = function(){
      $scope.writeToJson = "{";
      $scope.writeToJson += $scope.WrapperNameLine("Experiment",0);
      $scope.writeToJson += "\"children\": [";

      if($scope.numberOfBetweenArrangement == 1){
        var i;
        for(i=0; i < $scope.individual.length-1; i++){
          $scope.WriteParticipant(i,-1,"");
          $scope.writeToJson += ",";
        }

        $scope.WriteParticipant(i,-1,"");
      }
      else{
        var totalNumberofParticipants = $scope.numberOfParticipants * $scope.numberOfBetweenArrangement; // total participants
        //----------------------------------------------to be continued

      }

      $scope.writeToJson += "]}";
    };

    $scope.WriteParticipant = function(idInside, idParticipant, betweenString){
      $scope.writeToJson += "{";
      if(!betweenString || betweenString==""){
        if(idParticipant == -1)
            $scope.writeToJson += $scope.WrapperNameLine("Participant "+ idInside.toString(), 0);
        else
            $scope.writeToJson += $scope.WrapperNameLine("Participant "+ idParticipant.toString(), 0);
      }
      else{
        $scope.writeToJson += $scope.WrapperNameLine("Participant " + idParticipant.toString()+ betweenString.toString(), 0);
      }

      $scope.writeToJson += "\"children\": [";

      var i;
      for(i = 0; i < $scope.jsonData.design_guide.arrangement.block - 1; i++){
        $scope.WriteBlock(idInside,i);
        $scope.writeToJson += ",";
      }

      $scope.WriteBlock(idInside,i);
      $scope.writeToJson += "]}";
    };

    $scope.WriteBlock = function(idParticipant, idBlock){
      $scope.writeToJson += "{";
      $scope.writeToJson += $scope.WrapperNameLine("Block" + idBlock.toString(), 0);
      $scope.writeToJson += "\"children\": [";

      var i;
      for(i = 0; i < $scope.individual[idParticipant].length - 1; i++){
        $scope.WriteCondition(idParticipant, i);
        $scope.writeToJson += ",";
      }

      $scope.WriteCondition(idParticipant,i);

      $scope.writeToJson += "]}";
    };

    $scope.WriteCondition = function(idParticipant, idCondition){
      $scope.writeToJson += "{";
      var tmp = "(";
      var i;
      if($scope.individual[idParticipant][idCondition].length > 0){
        for(i=0; i < $scope.individual[idParticipant][idCondition].length - 1; i++){
          tmp += $scope.individual[idParticipant][idCondition][i].toString() + ",";
        }
        tmp += $scope.individual[idParticipant][idCondition][i] + ")";
      }
      else{
        tmp += ")";
      }

      $scope.writeToJson += $scope.WrapperNameLine("condition " + idCondition.toString() + ": " + tmp, 0);
      $scope.writeToJson += "\"children\": [";

      var n;
      for (n = 0; n < $scope.jsonData.design_guide.arrangement.trial - 1; n++){
        $scope.writeToJson += $scope.WrapperNameLine("Trial " + n.toString(), 1);
        $scope.writeToJson += ","
      }
      $scope.writeToJson += $scope.WrapperNameLine("Trial" + n.toString(), 1);
      $scope.writeToJson += "]}";
    };
});