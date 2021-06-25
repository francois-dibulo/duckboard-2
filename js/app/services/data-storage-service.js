NgApp.services.factory('DataStorageService', ['$http', '$q',
   function ($http, $q) {

  var service = {
    STORAGE_KEY: "data_cache",
    cache: {}
  };

  service.loadDataCache = function() {
    var data = localStorage.getItem(service.STORAGE_KEY);
    if (data) {
      data = JSON.parse(data);
    }
    return data || {};
  };

  service.saveCache = function() {
    localStorage.setItem(service.STORAGE_KEY, JSON.stringify(service.cache));
  };

  service.setDataProperty = function(prop, value) {
    service.cache[prop] = value;
    console.info("DataStorageService.SET", prop, value);
    this.saveCache();
  };

  service.getData = function(prop) {
    return this.cache[prop];
  };

  service.clearCache = function() {
    localStorage.clear(service.STORAGE_KEY);
  };

  service.init = function() {
    //this.clearCache();
    this.cache = this.loadDataCache();
  };

  return service;
}]);
