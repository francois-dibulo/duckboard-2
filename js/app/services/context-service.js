NgApp.services.factory('ContextService', ['$http', '$q', 'DataStorageService', 'ProjectService',
    function ($http, $q, DataStorageService, ProjectService) {

  var DATA_STORAGE_KEY = "context";
  var CONTEXT_ALL_KEY = "all";

  var service = {
    CONTEXT_ALL_KEY: CONTEXT_ALL_KEY,
    current_context_key: null,
    contexts: {},
  };

  service.getAll = function() {
    return this.contexts;
  };

  service.getCurrentContext = function() {
    return this.getContextByKey(this.current_context_key);
  };

  service.getContextByKey = function(ctx_key) {
    return this.contexts[ctx_key];
  };

  service.setCurrentContext = function(key) {
    var old_ctx = this.getCurrentContext();
    if (old_ctx) {
      old_ctx.active = false;
    }

    if (key === undefined) {
      key = Object.keys(this.contexts)[0] || null;
    }
    this.current_context_key = key;
    if (this.current_context_key) {
      var ctx = this.getCurrentContext();
      ctx.active = true;
      this.updateStorage();
    }
  };

  service.createContextEntity = function(title, id) {
    var ctx_id = id || guid();
    var ctx = {
      key: ctx_id,
      title: title,
      projects: [],
      active: false
    };
    return ctx;
  };

  service.addContext = function(title) {
    this.contexts[ctx_id] = this.createContextEntity(title);
    this.setCurrentContext(ctx_id);
    this.updateStorage();
    return ctx;
  };

  service.removeContext = function(ctx_key) {
    var is_active = ctx_key === this.current_context_key;
    var ctx = this.getContextByKey(ctx_key);
    if (ctx) {
      for (var i = 0; i < ctx.projects.length; i++) {
        ProjectService.removeProject(ctx.projects[i]);
      }
      delete this.contexts[ctx_key];
      if (is_active) {
        this.setCurrentContext(undefined);
      }
      ProjectService.updateStorage();
      this.updateStorage();
    }
  };

  service.addProjectToContext = function(ctx, project_key) {
    ctx.projects.push(project_key);
    this.updateStorage();
  };

  service.removeProjectFromContext = function(ctx, project_key) {
    var project_key_index = ctx.projects.indexOf(project_key);
    if (project_key_index > -1) {
      ctx.projects.splice(project_key_index, 1);
      this.updateStorage();
    }
  };

  service.updateStorage = function() {
    DataStorageService.setDataProperty(DATA_STORAGE_KEY, this.contexts);
  };

  var loadData = function() {
    return DataStorageService.getData(DATA_STORAGE_KEY) || {};
  };

  var initContextData = function() {
    var data = loadData();
    var active_ctx_key = undefined;
    service.contexts = {};

    // Create the "All" context
    service.contexts[CONTEXT_ALL_KEY] = service.createContextEntity("All", CONTEXT_ALL_KEY);

    for (var ctx_key in data) {
      var ctx = data[ctx_key];
      service.contexts[ctx_key] = ctx;
      if (ctx.active) {
        active_ctx_key = ctx_key;
      }
    }

    if (!service.current_context_key) {
      service.setCurrentContext(active_ctx_key);
    }

    console.log(service);
  };

  service.init = function() {
    initContextData();
  };

  return service;
}]);
