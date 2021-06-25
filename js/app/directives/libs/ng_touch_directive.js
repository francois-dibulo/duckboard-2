NgApp.directives.directive('ndTouch', [function() {
  return function(scope, element, attr) {
    var is_touch = 'ontouchstart' in document.documentElement;
    var event_down = is_touch ? 'touchstart' : 'mousedown';
    element.on(event_down, function(event) {
      scope.$apply(function() {
        scope.$eval(attr.ndTouch);
      });
      event.stopPropagation();
      event.preventDefault();
      return false;
    });
  };
}]);

NgApp.directives.directive('ndTouchEnd', [function() {
  return function(scope, element, attr) {
    var is_touch = 'ontouchstart' in document.documentElement;
    var event_up = is_touch ? 'touchend' : 'mouseup';
    element.on(event_up, function(event) {
      scope.$apply(function() {
        scope.$eval(attr.ndTouchEnd);
      });
      event.stopPropagation();
      event.preventDefault();
      return false;
    });
  };
}]);
