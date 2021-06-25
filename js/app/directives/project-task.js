NgApp.directives.directive("projectTask", [
  'ContextService', 'TasksService',
  function(ContextService, TasksService) {
  return {
    // E = element, A = attribute, C = class, M = comment
    restrict: 'EA',
    templateUrl: function(elem, attrs) {
      return attrs.templateUrl || 'views/app/directives/project-task.html';
    },
    scope: {
      // @ reads the attribute value, = provides two-way binding, & works with functions
      key: '=',
    },
    // Embed a custom controller in the directive
    controller: function($scope) {
      $scope.task = TasksService.getTaskByKey($scope.key);

      $scope.removeTask = function() {
        $scope.$emit('TASK_REMOVE', $scope.task.key);
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
        TasksService.setTasksState(task, TasksService.STATE.ARCHIVED);
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
