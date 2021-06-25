/**
 * This is an example directive. Use it to kickstart a new directive.
 * Happy Coding. Please remove me before releasing.
*/
NgApp.directives.directive("exampleDirective", [function() {
  return {
    // E = element, A = attribute, C = class, M = comment
    restrict: 'EA',
    templateUrl: function(elem, attrs) {
      return attrs.templateUrl || 'views/directives/_example_directive.html';
    },
    scope: {
      // @ reads the attribute value, = provides two-way binding, & works with functions
      items: '=items',
      key: '@',
    },
    // Embed a custom controller in the directive
    controller: function($scope) {

    },
    // DOM manipulation
    link: function ($scope, element, attrs) {

    }
  };
}]);
