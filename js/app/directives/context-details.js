NgApp.directives.directive("contextDetails", [
  'ContextService', 'ProjectService', 'TasksService',
  function(ContextService, ProjectService, TasksService) {
  return {
    // E = element, A = attribute, C = class, M = comment
    restrict: 'EA',
    templateUrl: function(elem, attrs) {
      return attrs.templateUrl || 'views/app/directives/context-details.html';
    },
    scope: {
      // @ reads the attribute value, = provides two-way binding, & works with functions
      context: '='
    },
    // Embed a custom controller in the directive
    controller: function($scope) {
      $scope.projects = [];

      var init = function(ctx) {
        ctx = ctx || $scope.context;
        $scope.projects = ProjectService.getProjectsForContext(ctx);
      };

      $scope.$watch('context', function(current, old) {
        init(current);
      });

      $scope.$on('TASK_KANBAN_UPDATE', function() {
        init();
        $scope.$broadcast('KANBAN_UPDATE');
      });

      $scope.addProject = function() {
        $scope.$parent.addProject();
        init($scope.context);
      };

      $scope.removeProject = function(project) {
        $scope.$parent.removeProject(project);
        init($scope.context);
      };

      $scope.removeContext = function(ctx) {
        $scope.$parent.removeContext(ctx);
      };

    },
    // DOM manipulation
    link: function ($scope, element, attrs) {

    }
  };
}]);
