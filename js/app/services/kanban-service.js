NgApp.services.factory('KanbanService', ['$http', '$q',
    function ($http, $q) {

  var service = {
    State: {
      next: {
        KEY: "next",
        label: "Next",
      },
      progress: {
        KEY: "progress",
        label: "In Progress",
      },
      blocked: {
        KEY: "blocked",
        label: "Blocked",
      },
      done: {
        KEY: "done",
        label: "Done",
      }
    }
  };
 
  service.init = function() {

  };

  return service;
}]);
