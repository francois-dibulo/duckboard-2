NgApp.services.factory('ProjectService', ['$http', '$q', 'DataStorageService', 'TasksService',
    function ($http, $q, DataStorageService, TasksService) {

  var DATA_STORAGE_KEY = "projects";
  var CONTEXT_ALL_KEY = "all";

  var PROJECT_STATE = {
    IDLE: 0,
    ARCHIVED: 1
  };

  var service = {
    projects: {}
  };

  service.getProjectsForContext = function(ctx) {
    var result = [];
    if (!ctx) return result;
    var project_keys = ctx.projects;

    var requesting_all = ctx.key === CONTEXT_ALL_KEY;
    // "All" context is special. We require all projects
    if (requesting_all) {
      project_keys = Object.keys(this.projects);
    }

    for (var i = 0; i < project_keys.length; i++) {
      var project = this.getProjectByKey(project_keys[i]);
      if (project) {

        if (requesting_all && !project.include_all) {
          continue;
        }

        result.push(project);
      }
    }

    return result;
  };

  service.getProjectByKey = function(key) {
    return this.projects[key];
  };

  service.addProject = function(title) {
    var id = guid(); // TODO get from backend
    var entity = {
      key: id,
      title: title,
      created_at: new Date().getTime(),
      tasks: [],
      include_all: true
    };
    this.projects[id] = entity;
    this.updateStorage();
    return entity;
  };

  service.removeProject = function(key) {
    var project = this.getProjectByKey(key);
    if (project) {
      TasksService.removeTasksByKey(project.tasks);
      delete this.projects[key];
      TasksService.updateStorage();
      this.updateStorage();
    }
  };

  service.addTask = function(project_key, task_key) {
    var project = this.getProjectByKey(project_key);
    if (project) {
      project.tasks.push(task_key);
    }
    this.updateStorage();
  };

  service.removeTask = function(project_key, task_key) {
    var project = this.getProjectByKey(project_key);
    if (project) {
      var index = project.tasks.indexOf(task_key);
      if (index > -1) {
        project.tasks.splice(index, 1);
      }
    }
    this.updateStorage();
  };

  // var loadData = function() {
  //   // return {
  //   //  "p1": {
  //   //      key: "p1",
  //   //      title: "AppEngine",
  //   //      tasks: ["t1"],
  //   //      state: PROJECT_STATE.IDLE
  //   //   },
  //   //   "p2": {
  //   //     key: "p2",
  //   //     title: "Store",
  //   //     tasks: ["t1", "t2"],
  //   //     state: PROJECT_STATE.IDLE
  //   //   }
  //   // }
  // };

  service.updateStorage = function() {
    DataStorageService.setDataProperty(DATA_STORAGE_KEY, this.projects);
  };

  var loadData = function() {
    return DataStorageService.getData(DATA_STORAGE_KEY) || {};
  };

  var initData = function() {
    var data = loadData();
    service.projects = {};
    for (var key in data) {
      var entity = data[key];
      service.projects[key] = entity;
    }

    console.log("ProjectService", service);
  };

  service.init = function() {
    initData();
  };

  return service;
}]);
