NgApp.directives.directive("projectDetails", [
  'ContextService', 'ProjectService', 'TasksService',
  function(ContextService, ProjectService, TasksService) {
  return {
    // E = element, A = attribute, C = class, M = comment
    restrict: 'EA',
    templateUrl: function(elem, attrs) {
      return attrs.templateUrl || 'views/app/directives/project.html';
    },
    scope: {
      // @ reads the attribute value, = provides two-way binding, & works with functions
      project: '='
    },
    // Embed a custom controller in the directive
    controller: function($scope) {

      $scope.form = {
        task: {
          title: null,
          url: null
        }
      };

      $scope.addTaskToProject = function(project) {
        var task = TasksService.addTask($scope.form.task);
        if (task) {
          ProjectService.addTask(project.key, task.key);
        }
        $scope.form = {
          task: {
            title: null,
            url: null
          }
        };
      };

      $scope.removeProject = function(project) {
        $scope.$parent.removeProject(project);
      };

      $scope.$on('TASK_REMOVE', function(event, task_key) {
        TasksService.removeTask(task_key);
        ProjectService.removeTask($scope.project.key, task_key);
        $scope.$emit('TASK_KANBAN_UPDATE');
      });

      $scope.$on('TASK_SHOW_INFO', function(event, task) {
        $scope.$broadcast('TASK_INFO', task);
      });

    },
    // DOM manipulation
    link: function ($scope, element, attrs) {

    }
  };
}]);
