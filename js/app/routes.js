var VIEW_PATH = "views/app/";
NgApp.app = angular.module(Config.APP_NAME, Config.getDependencies());

NgApp.app.config(['$routeProvider', '$compileProvider', '$translateProvider',
  function($routeProvider, $compileProvider, $translateProvider) {

    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(false);
    $compileProvider.commentDirectivesEnabled(false);
    $compileProvider.cssClassDirectivesEnabled(false);

    // ===================================================================================
    // i18n
    // https://angular-translate.github.io/
    // ===================================================================================
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/i18n/locale-',
        suffix: '.json'
    });
    var default_lang_key = "en";
    var system_language_key = navigator.language.split("-")[0];
    var lang_key = system_language_key || default_lang_key;
    $translateProvider.preferredLanguage(lang_key);
    $translateProvider.fallbackLanguage(default_lang_key);

    // ===================================================================================
    // ROUTING
    // ===================================================================================

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
