var VIEW_PATH = "views/app/";
NgApp.app = angular.module(Config.APP_NAME, Config.getDependencies());

NgApp.app.config(['$routeProvider', '$compileProvider',
  function($routeProvider, $compileProvider) {

    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(false);
    $compileProvider.commentDirectivesEnabled(false);
    $compileProvider.cssClassDirectivesEnabled(false);

    $routeProvider.
      when('/', {
        templateUrl: VIEW_PATH + 'main.html'
        //controller: 'MainCtrl'
      }).
      when('/info', {
        templateUrl: VIEW_PATH + 'info.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

window.onload = function() {
  NgApp.app.run(function($rootScope) {});
}
