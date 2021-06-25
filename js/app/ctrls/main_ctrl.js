NgApp.controllers.controller('MainCtrl',
    ['$scope', '$location', '$timeout', '$routeParams', 'DataStorageService', 'ContextService', 'ProjectService', 'TasksService',
    function ($scope, $location, $timeout, $routeParams, DataStorageService, ContextService, ProjectService, TasksService) {

  $scope.init = function() {
    // TODO: Load all data and then insert to the services
    DataStorageService.init();
    ContextService.init();
    ProjectService.init();
    TasksService.init();
  };

  $scope.getCurrentContext = function() {
    return ContextService.getCurrentContext();
  };

}]);
