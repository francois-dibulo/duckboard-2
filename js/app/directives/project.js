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
          parent: null,
          url: null
        }
      };

      $scope.addTaskToProject = function(project) {
        var parent_key = $scope.form.task.parent ? $scope.form.task.parent.key : null;
        var task = TasksService.addTask($scope.form.task, parent_key);

        if (task) {
          if (parent_key) {
            TasksService.addChildTask($scope.form.task.parent, task);
          }
          ProjectService.addTask(project.key, task.key);
        }
        $scope.form = {
          task: {
            title: null,
            parent: null,
            url: null
          }
        };
      };

      $scope.removeProject = function(project) {
        var conf = confirm("Remove " + project.title + " and all of its tasks?");
        if (conf) {
          $scope.$parent.removeProject(project);
        }
      };

      $scope.onProjectChangeIncludeAll = function(project) {
        ProjectService.updateStorage();
        $scope.$emit('TASK_KANBAN_UPDATE');
      };

      $scope.$on('TASK_REMOVE', function(event, task_key) {
        TasksService.removeTask(task_key);
        ProjectService.removeTask($scope.project.key, task_key);
        $scope.$emit('TASK_KANBAN_UPDATE');
      });

      $scope.$on('TASK_SHOW_INFO', function(event, task) {
        $scope.$broadcast('TASK_INFO', task);
      });

      $scope.$on('TASK_ADD_CHILD', function(event, parent_task) {
        $scope.form.task.parent = parent_task;
      });

      $scope.removeFormParent = function() {
        $scope.form.task.parent = null;
      };

      $scope.isNotChildTask = function(task_key) {
        return !TasksService.isChild(task_key);
      };

    },
    // DOM manipulation
    link: function ($scope, element, attrs) {

    }
  };
}]);
