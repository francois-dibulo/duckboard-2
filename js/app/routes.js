var VIEW_PATH = "views/app/";
NgApp.app = angular.module(Config.APP_NAME, Config.getDependencies());

NgApp.app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: VIEW_PATH + 'main.html'
        //controller: 'MainCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

window.onload = function() {
  NgApp.app.run(function($rootScope) {});
}
