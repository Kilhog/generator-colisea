controller('Ctrl%%0%%Detail', ['$scope', '$location', 'DataServices', '$state', '$timeout', '$modal', '$stateParams',
  function($scope, $location, DataServices, $state, $timeout, $modal, $stateParams) {
    var object_name = '%%0%%';

    $scope.object_name = object_name;
    $scope.state = {};
    $scope.state.modifier = ($stateParams.Id == 0);
    $scope.droits = new preset_droits(object_name, DataServices);
    $scope.%%1%% = ($stateParams.Id != 0) ? DataServices.get({name: object_name, id: $stateParams.Id}) : {result: {id:0}};
    $scope.show_error_delete = false;

    $scope.supprimer = new preset_supprimer($scope.object_name, $stateParams.Id, DataServices, $location, $scope, $modal, function(id) {
      $state.go("%%0%%.liste");
    }, function(error) {
      if(error.data.msg == "Failed to remove object") {
        $scope.show_error_delete = true;
        $timeout(function() {
          $scope.show_error_delete = false;
        }, 4000);
      }
    });

    $scope.annuler = new preset_annuler($scope, $modal, function() {
      $state.go('%%0%%.liste');
    });

    $scope.save = function() {
      $scope.%%1%%.result.name = "%%0%%";

      preset_save(DataServices, $scope.%%1%%.result, function(id) {
        $state.go("%%0%%.liste");
      });
    };
}]);
