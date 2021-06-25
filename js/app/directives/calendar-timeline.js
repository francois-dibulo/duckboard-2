NgApp.directives.directive("calendarTimeline", [
  'CalendarTimelineService',
  function(CalendarTimelineService) {
  return {
    // E = element, A = attribute, C = class, M = comment
    restrict: 'EA',
    templateUrl: function(elem, attrs) {
      return attrs.templateUrl || 'views/app/directives/calendar-timeline.html';
    },
    scope: {
      // @ reads the attribute value, = provides two-way binding, & works with functions
      // items: '=items',
      // key: '@',
    },
    // Embed a custom controller in the directive
    controller: function($scope) {
      $scope.dates = CalendarTimelineService.getNextDates();
    },
    // DOM manipulation
    link: function ($scope, element, attrs) {

    }
  };
}]);
