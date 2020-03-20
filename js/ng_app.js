/**
  Angular JS setup
*/
var Config = {
  // @const {String} APP_NAME - The name of the angular module
  APP_NAME: 'ngApp',
  // @var {Object} dependencies - Dictionary of the angular dependency modules
  dependencies: {
    controllers: 'ngAppControllers',
    services: 'ngAppServices',
    directives: 'ngAppDirectives',
    filters: 'ngAppFilters'
  },

  /**
   * @desc Returns list of dependencies
   * @return {Array}
   */
  getDependencies: function() {
    var dependencies = [];
    for(var depenceny in this.dependencies) {
      dependencies.push(this.dependencies[depenceny]);
    }
    dependencies.push('ngRoute');
    dependencies.push('ngAnimate');
    dependencies.push('pascalprecht.translate');
    return dependencies;
  }
};

var NgApp = NgApp || {
  app: null,
  services: null,
  controllers: null,
  directives: null
};

/**
 * Provide shortcut and to avoid long module code.
 * Instead use it like:
 *   NgApp.controllers.controller('YourCtrl', ['$scope', function ($scope) { ... }]);
 */
NgApp.controllers = angular.module(Config.dependencies.controllers, []);
NgApp.services = angular.module(Config.dependencies.services, []);
NgApp.directives = angular.module(Config.dependencies.directives, []);
NgApp.filters = angular.module(Config.dependencies.filters, []);
