NgApp.directives.directive("taskInfo", [
  'ContextService', 'ProjectService', 'TasksService',
  function(ContextService, ProjectService, TasksService) {
  return {
    // E = element, A = attribute, C = class, M = comment
    restrict: 'EA',
    templateUrl: function(elem, attrs) {
      return attrs.templateUrl || 'views/app/directives/task-info-modal.html';
    },
    scope: {
      // @ reads the attribute value, = provides two-way binding, & works with functions
      //project: '='
    },
    // Embed a custom controller in the directive
    controller: function($scope) {
      $scope.task = null;

      $scope.close = function() {
        $scope.task = null;
      };

      $scope.getTotalTime = function(task) {
        if (task) {
          return TasksService.getTimetrackingHuman(task);
        }
        return "Not started";
      };

      $scope.removeTimeEntry = function(task, index) {
        TasksService.removeTimeEntry(task, index);
      };

      $scope.getHoursDelta = function(ts) {
        var start = ts.start_ts;
        var end = ts.end_ts || new Date().getTime();
        console.log("end", end, new Date().getTime());
        var data = msToTime(end - start);
        if (data.hours) {
          return data.hours + " hrs";
        }
        return data.minutes + " min";
      };

      $scope.getFormattedDate = function(ts) {
        if (!ts) {
          ts = new Date().getTime();
        }
        var date = new Date(ts);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var hour = date.getHours();
        var minutes = date.getMinutes();

        day = day < 9 ? "0" + day : day;
        month = month < 9 ? "0" + month : month;
        hour = hour < 9 ? "0" + hour : hour;
        minutes = minutes < 9 ? "0" + minutes : minutes;

        return day + "." + month + " " + hour + ":" + minutes;
      };

      $scope.getDateTimeValue = function(ts) {
        // 2021-06-13T13:00
        var date = new Date(ts);
        // "2021-06-08T15:23:36.000Z"
        var iso = date.toISOString();
        var index = date.toISOString().lastIndexOf(":");
        return iso.substr(0, index);
      };

      $scope.updateTime = function(task, ts, ts_key, date_key) {
        console.log("change", task, ts);
        ts[ts_key] = ts[date_key].getTime();
      };

      $scope.$on('TASK_INFO', function(event, task) {
        $scope.task = task;
      });

    },
    // DOM manipulation
    link: function ($scope, element, attrs) {

    }
  };
}]);
