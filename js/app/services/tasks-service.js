NgApp.services.factory('TasksService', ['$http', '$q', 'DataStorageService',
    function ($http, $q, DataStorageService) {

  var DATA_STORAGE_KEY = "tasks";

  var TASK_STATE = {
    IDLE: null,
    NEXT: 0,
    PROGRESS: 1,
    BLOCKED: 2,
    DONE: 3,
    ARCHIVED: 4,
    SNOOZED: 5
  };

  var STATE_MAP = {
    0: "next",
    1: "progress",
    2: "blocked",
    3: "done",
    4: "archived",
    5: "snoozed"
  };

  var service = {
    tasks: {},
    STATE: TASK_STATE,
    STATE_MAP: STATE_MAP
  };

  service.getTasksForProject = function(project) {
    var result = [];
    var task_keys = project.tasks;

    for (var i = 0; i < task_keys.length; i++) {
      var task = this.getTaskByKey(task_keys[i]);
      if (task) {
        result.push(task);
      }
    }

    return result;
  };

  service.getTaskByKey = function(key) {
    return this.tasks[key];
  };

  service.setTasksState = function(task, state) {
    this.stopTimeTracking(task);
    task.state = state;
    this.updateStorage();
  };

  service.archiveTask = function(task) {
    task.archived_at = new Date().getTime();
    this.setTasksState(task, TASK_STATE.ARCHIVED);
  };

  service.addTask = function(opts, parent_key) {
    var id = guid();
    var entity = {
      key: id,
      created_at: new Date().getTime(),
      archived_at: null,
      title: opts.title,
      url: opts.url,
      state: TASK_STATE.IDLE,
      comment: null,
      time_tracking: {
        active: false,
        timestamps: []
      },
      snoozed: null,
      parent_key: parent_key || null,
      children: [],
      events: null
    };
    this.tasks[id] = entity;
    this.updateStorage();
    return entity;
  };

  service.removeTask = function(id, no_save) {
    var task = this.tasks[id];

    // Is a child
    if (task && this.isChild(task.key)) {
      this.removeChildTask(task);
    }

    // Has children
    if (task && task.children && task.children.length) {
      this.removeTasksByKey(task.children);
    }

    delete this.tasks[id];
    if (!no_save) {
      this.updateStorage();
    }
  };

  service.removeTasksByKey = function(task_keys) {
    for (var i = task_keys.length - 1; i >= 0; i--) {
      this.removeTask(task_keys[i], true);
    }
  };

  service.addChildTask = function(parent_task, child_task) {
    if (!parent_task.children) {
      parent_task.children = [];
    }

    if (parent_task.children.indexOf(child_task.key) === -1) {
      child_task.parent_key = parent_task.key;
      parent_task.children.push(child_task.key);
    }
  };

  service.removeChildTask = function(child_task) {
    var parent_task = this.getTaskByKey(child_task.parent_key);
    if (parent_task && parent_task.children) {
      var index = parent_task.children.indexOf(child_task.key);
      if (index > -1) {
        parent_task.children.splice(index, 1);
      }
    }
    child_task.parent_key = null;
  };

  service.isChild = function(task_key) {
    var task = this.getTaskByKey(task_key);
    if (task && task.parent_key !== undefined) {
      return task.parent_key !== null;
    }
    return false;
  };

  service.startTimeTracking = function(task) {
    var now_date = new Date();
    var now = now_date.getTime();
    task.time_tracking.active = true;
    task.time_tracking.timestamps.push({
      start_date: now_date,
      start_ts: now,
      end_ts: 0,
      end_date: now_date
    });
    this.updateStorage();
    console.log("START", task.time_tracking);
  };

  service.stopTimeTracking = function(task) {
    var now_date = new Date();
    var now = now_date.getTime();
    task.time_tracking.active = false;
    var last_index = task.time_tracking.timestamps.length - 1;
    var last_item = task.time_tracking.timestamps[last_index];
    if (last_item) {
      if (last_item.end_ts === 0) {
        last_item.end_ts = now;
        last_item.end_date = now_date;
      }
    }
    this.updateStorage();
    console.log("STOP", task.time_tracking);
  };

  service.removeTimeEntry = function(task, index) {
    task.time_tracking.timestamps.splice(index, 1);
    this.updateStorage();
  };

  service.getTimetrackingHours = function(task) {
    var timestamps = task.time_tracking.timestamps;
    var total_ms = 0;
    var now = new Date().getTime();
    for (var i = 0; i < timestamps.length; i++) {
      var ts_items = timestamps[i];
      var start_ts = ts_items.start_ts;
      var end_ts = ts_items.end_ts || now; // if we are still tracking, just say now
      var delta = end_ts - start_ts;
      total_ms += delta;
    }
    return msToTime(total_ms);
  };

  service.getTimetrackingHuman = function(task) {
    var time = this.getTimetrackingHours(task);
    var min_str = time.minutes === 1 ? "minute" : "minutes";
    var hrs_str = time.hours === 1 ? "hour" : "hours";

    if (!time.hours && !time.minutes && !time.seconds) {
      return "Not started";
    } else if (!time.hours && !time.minutes) {
      return time.seconds + " seconds";
    } else if (!time.hours) {
      return time.minutes + " " + min_str;
    }
    return time.hours + " " + hrs_str + " " + time.minutes + " " + min_str;
  };

  service.updateStorage = function() {
    DataStorageService.setDataProperty(DATA_STORAGE_KEY, this.tasks);
  };

  var loadData = function() {
    return DataStorageService.getData(DATA_STORAGE_KEY) || {};
  };

  //var loadData = function() {
    // return {
    //   "t1": {
    //     key: "t1",
    //     title: "Create Dibulo.com",
    //     created_at: 1621634400267,
    //     state: TASK_STATE.IDLE,
    //     url: "http://weberdevelopment.de",
    //     comment: "Yo check this out",
    //     time_tracking: {
    //       active: false,
    //       timestamps: [
    //         { start_ts: 1622894436000, end_ts: 1622912436000, start_date: new Date(1622894436000), end_date: new Date(1622912436000) },
    //         { start_ts: 1623070836000, end_ts: 1623165816000, start_date: new Date(1623070836000), end_date: new Date(1623165816000) }
    //       ]
    //     },
    //     snoozed: null,
    //     parent_id: null,
    //     events: null
    //   },
    //   "t2": {
    //     key: "t2",
    //     title: "Release duckboard",
    //     created_at: 1621634300267,
    //     state: TASK_STATE.IDLE,
    //     url: null,
    //     comment: null,
    //     time_tracking: {
    //       active: false,
    //       timestamps: []
    //     },
    //     snoozed: null,
    //     parent_id: null,
    //     events: null
    //   }
    // }
  //};

  var initData = function() {
    var data = loadData();
    service.tasks = {};
    for (var key in data) {
      var entity = data[key];
      service.tasks[key] = entity;
    }

    console.log("TasksService", service);
  };

  service.init = function() {
    initData();
  };

  return service;
}]);
