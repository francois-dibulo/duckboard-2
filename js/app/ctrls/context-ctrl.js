NgApp.controllers.controller('ContextCtrl',
    ['$scope', '$location', '$timeout', '$routeParams', 'ContextService', 'ProjectService',
    function ($scope, $location, $timeout, $routeParams, ContextService, ProjectService) {

  $scope.current_context = null;

  var addContext = function() {
    var title = prompt("Name your new context");
    if (title) {
      var ctx = ContextService.addContext(title);
      if (ctx) {
        $scope.current_context = ctx;
      }
    }
  };

  $scope.addProject = function() {
    var title = prompt("Project title");
    if (title) {
      var project = ProjectService.addProject(title);
      ContextService.addProjectToContext($scope.current_context, project.key);
    }
  };

  $scope.removeProject = function(project) {
    ProjectService.removeProject(project.key);
    ContextService.removeProjectFromContext($scope.current_context, project.key);
  };

  $scope.removeContext = function(ctx) {
    ContextService.removeContext(ctx.key);
    setCurrentContext();
  };

  var setCurrentContext = function() {
    $scope.current_context = ContextService.getCurrentContext();
  };

  $scope.$on('CTX_ADD', addContext);

  $scope.$on('CTX_SET', function(event, ctx) {
    ContextService.setCurrentContext(ctx.key);
    setCurrentContext();
    // $scope.$broadcast('CTX_UPDATE', $scope.current_context);
  });

  $scope.init = function() {
    setCurrentContext();
  };

}]);
