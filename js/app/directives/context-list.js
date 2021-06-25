NgApp.directives.directive("contextsList", [
  'ContextService',
  function(ContextService) {
  return {
    // E = element, A = attribute, C = class, M = comment
    restrict: 'EA',
    templateUrl: function(elem, attrs) {
      return attrs.templateUrl || 'views/app/directives/context-list.html';
    },
    scope: {
      // @ reads the attribute value, = provides two-way binding, & works with functions
      // items: '=items',
      // key: '@',
    },
    // Embed a custom controller in the directive
    controller: function($scope) {
      $scope.contexts = ContextService.getAll();

      $scope.removeContext = function(ctx) {
        ContextService.removeContext(ctx.key);
      };

      $scope.onContextClick = function(ctx) {
        $scope.$emit('CTX_SET', ctx);
      };

      $scope.addContext = function() {
        $scope.$emit('CTX_ADD');
      };

    },
    // DOM manipulation
    link: function ($scope, element, attrs) {

    }
  };
}]);
