NgApp.directives.directive("inputToggle", [function() {
  return {
    // E = element, A = attribute, C = class, M = comment
    restrict: 'EA',
    templateUrl: function(elem, attrs) {
      return attrs.templateUrl || 'views/app/directives/input_toggle.html';
    },
    scope: {
      // @ reads the attribute value, = provides two-way binding, & works with functions
      // items: '=items',
      prop: '='
    },
    // Embed a custom controller in the directive
    controller: function($scope) {
      $scope.toggle = function() {
        $scope.prop = !$scope.prop;
      };
    },
    // DOM manipulation
    link: function ($scope, element, attrs) {
    }
  };
}]);
