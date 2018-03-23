NgApp.services.factory('FileLoaderService', ['$http', '$q', function ($http, $q) {

  var service = {
    files_cache: {}
  };

  service.clearCache = function() {
    this.files_cache = {};
  };

  service.getFile = function(file) {
    return files_cache[file];
  };

  service.requestFile = function(file_name, base_url) {
    var url = base_url + file_name;
    return $http.get(url);
  };

  service.loadFiles = function(files, base_url) {
    var self = this;
    var deferred = $q.defer();
    var resolved_count = 0;

    var checkResolved = function() {
      if (resolved_count >= files.length) {
        deferred.resolve(self.files_cache);
      }
    };

    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // We already loaded those files
      if (self.files_cache[file]) {
        resolved_count++;
        checkResolved();
        continue;
      }

      (function(file) {
        self.requestFile(file, base_url).then(function(data) {
          var result = data.data;
          if (result) {
            self.files_cache[file] = result;
          }
          resolved_count++;
          checkResolved();
        });

      })(file);
    }

    return deferred.promise;
  };

  return service;
}]);
