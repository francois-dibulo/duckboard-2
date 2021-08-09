NgApp.directives.directive("projectTask", [
  'ContextService', 'TasksService', '$timeout',
  function(ContextService, TasksService, $timeout) {
  return {
    // E = element, A = attribute, C = class, M = comment
    restrict: 'EA',
    templateUrl: function(elem, attrs) {
      return attrs.templateUrl || 'views/app/directives/project-task.html';
    },
    scope: {
      // @ reads the attribute value, = provides two-way binding, & works with functions
      key: '=',
      project: '=',
      child: '@'
    },
    // Embed a custom controller in the directive
    controller: function($scope) {
      $scope.task = TasksService.getTaskByKey($scope.key);

      if (!$scope.task) {
        console.warn("No task :: removing", $scope.key, $scope.task, $scope.project);
        $timeout(function() {
          $scope.removeTask($scope.key);
        }, 0);
      }

      $scope.removeTask = function(key) {
        key = key || $scope.task.key;
        $scope.$emit('TASK_REMOVE', key);
      };

      $scope.addChildTask = function(parent_task) {
        $scope.$emit('TASK_ADD_CHILD', parent_task);
      };

      $scope.isOnKanban = function(task) {
        if (task.state === null) {
          return false;
        }
        return task.state >= TasksService.STATE.NEXT && task.state <= TasksService.STATE.DONE;
      };

      $scope.isSnoozed = function(task) {
        return task.state === TasksService.STATE.SNOOZED;
      };

      $scope.isArchived = function(task) {
        return task.state === TasksService.STATE.ARCHIVED;
      };

      $scope.getStateClass = function(task) {
        if (task.state === null) {
          return "idle";
        }
        return TasksService.STATE_MAP[task.state];
      };

      $scope.archiveTask = function(task) {
        TasksService.archiveTask(task);
        $scope.$emit('TASK_KANBAN_UPDATE');
      };

      $scope.showTaskInfo = function(task) {
        $scope.$emit('TASK_SHOW_INFO', task);
      };

      $scope.toggleKanbanState = function(task) {
        var state = $scope.isOnKanban(task) ? null : 0;
        TasksService.setTasksState(task, state);
        $scope.$emit('TASK_KANBAN_UPDATE');
      };

    },
    // DOM manipulation
    link: function ($scope, element, attrs) {

    }
  };
}]);
