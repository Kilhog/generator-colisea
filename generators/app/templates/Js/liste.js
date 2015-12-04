controller('Ctrl%%0%%Liste', ['$scope', '$location', 'DataServices', '$state', '$timeout', '$modal',
  function($scope, $location, DataServices, $state, $timeout, $modal) {
    var object_name = '%%0%%';

    $scope.object_name = object_name;
    $scope.recherche = new preset_recherche(object_name, $scope, DataServices, $modal);
    $scope.count = DataServices.query({name: object_name, count : "1"});
    $scope.pagination = new preset_pagination(object_name, $scope, DataServices);
    $scope.tri = new preset_tri($scope.object_name, $scope, DataServices);
    $scope.droits = new preset_droits(object_name, DataServices);

    $scope.refresh_data = function() {
      var query = {
        name: object_name, n: $scope.pagination.numPerPage, p: $scope.pagination.currentPage,
        sort: $scope.tri.sort, order: $scope.tri.order
      };

      query = $scope.recherche.change_where(query);
      query = $scope.tri.update_join(query);

      $scope.%%1%% = DataServices.query(query);
    };

    $scope.create = function() {
      preset_create(object_name, $location)
    };

    $scope.refresh_data();
}]).
