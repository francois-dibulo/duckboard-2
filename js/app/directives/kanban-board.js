NgApp.directives.directive("kanbanBoard", ['KanbanService', 'TasksService', '$timeout',
  function(KanbanService, TasksService, $timeout) {
  return {
    // E = element, A = attribute, C = class, M = comment
    restrict: 'EA',
    templateUrl: function(elem, attrs) {
      return attrs.templateUrl || 'views/app/directives/kanban-board.html';
    },
    scope: {
      // @ reads the attribute value, = provides two-way binding, & works with functions
      items: '=',
    },
    // Embed a custom controller in the directive
    controller: function($scope) {
      $scope.columns = KanbanService.State;
      $scope.column_tasks = {
        next: [],
        progress: [],
        blocked: [],
        done: []
      };

      var COLUMN_MAPPING = [
        "next",
        "progress",
        "blocked",
        "done"
      ];

      var getKanbanColumnKey = function(state) {
        if (state === null || state > TasksService.STATE.DONE) {
          return false;
        }
        return COLUMN_MAPPING[state];
      };

      var fillColumns = function() {
        $scope.column_tasks = {};
        var buckets = {};
        var projects = $scope.items;

        for (var col_key in $scope.columns) {
          buckets[col_key] = [];
        }

        for (var i = 0; i < projects.length; i++) {
          var project = projects[i];
          var tasks = TasksService.getTasksForProject(project);
          for (var t = 0; t < tasks.length; t++) {
            var task = tasks[t];
            var bucket_key = getKanbanColumnKey(task.state);
            if (bucket_key !== false) {
              task.project_key = project.key;
              task.project_title = project.title;
              if (!buckets[bucket_key]) {
                buckets[bucket_key] = [];
              }
              buckets[bucket_key].push(task);
            }
          }

        }

        $scope.column_tasks = buckets;
      };

      $scope.removeTask = function(task, index, col_key) {
        TasksService.setTasksState(task, TasksService.STATE.IDLE);
        $scope.column_tasks[col_key].splice(index, 1);
      };

      $scope.getTimetrackingHours = function(task) {
        return TasksService.getTimetrackingHuman(task);
      };

      $scope.$watch('items', function(current, old) {
        fillColumns();
      });

      $scope.$on('KANBAN_UPDATE', function(event) {
        fillColumns();
      });

      // =================================================================================
      // DRAG DROP
      // =================================================================================
      var dragged_item_data = null;
      var tracking_timeout = {};

      $scope.canDrop = function(evt) {
        event.preventDefault();
      };

      $scope.onDragEnterDay = function(evt) {
        evt.target.classList.add('drag-enter-allowed');
      };

      $scope.onDragLeaveDay = function(evt) {
        event.target.classList.remove('drag-enter-allowed');
      };

      $scope.onDrag = function(evt) {
        var key = evt.target.getAttribute("data-key");
        var parent_key = evt.target.getAttribute("data-parent-key");
        dragged_item_data = key;
        evt.dataTransfer.setData("item_index", parseInt(key, 10));
        evt.dataTransfer.setData("parent_item_index", parent_key);
        console.log("ondrag", parent_key, key);
      };

      $scope.onDragEnd = function(evt) {
        dragged_item_data = null;
      };

      $scope.onDropItem = function(evt) {
        var drop_col_key = evt.target.getAttribute("data-key");
        var item_index = parseInt(evt.dataTransfer.getData("item_index"), 10);
        var src_col_key = evt.dataTransfer.getData("parent_item_index");
        console.log("Dropped", drop_col_key, "Parent", src_col_key, "item", item_index);

        if (drop_col_key === src_col_key || !drop_col_key) {
          return;
        }

        // Move from source to target
        var item = $scope.column_tasks[src_col_key][item_index];
        $scope.column_tasks[src_col_key].splice(item_index, 1);
        $scope.column_tasks[drop_col_key].push(item);

        TasksService.setTasksState(item, COLUMN_MAPPING.indexOf(drop_col_key));

        if (tracking_timeout[item.key]) {
          $timeout.cancel(tracking_timeout[item.key]);
          delete tracking_timeout[item.key];
        }

        // Time tracking
        if (drop_col_key === "progress") {
          tracking_timeout[item.key] = $timeout(function() {
            TasksService.startTimeTracking(item);
          }, 2000);
        } else if (src_col_key === "progress") {
          TasksService.stopTimeTracking(item);
        }

        console.log(item);

        $scope.$apply();
        dragged_item_data = null;
        evt.preventDefault();
      };

    },
    // DOM manipulation
    link: function ($scope, element, attrs) {



    }
  };
}]);
