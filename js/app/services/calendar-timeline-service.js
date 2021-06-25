NgApp.services.factory('CalendarTimelineService', ['$http', '$q',
    function ($http, $q) {

  var WEEKDAY_NAMES = [
    "SU", "MO", "TU", "WE", "TH", "FR", "SA"
  ];

  var service = {};

  service.getNextDates = function(start_day, start_month, start_year, limit) {
    var dates = [];
    limit = limit || 14;
    var date = new Date();
    start_month = start_month || date.getMonth();
    start_day = start_day || date.getDate();
    start_year = start_year || date.getFullYear();
    date.setFullYear(start_year, start_month, start_day);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    var init_date_ts = date.getTime();

    var today = new Date();
    var today_date = today.getDate();
    var today_month = today.getMonth();
    var today_year = today.getFullYear();

    for (var i = 0; i < limit; i++) {
      var base_date = new Date(init_date_ts);
      var next_date_ts = base_date.setDate(date.getDate() + i);
      var next_date = new Date(next_date_ts);

      var next_day = next_date.getDate();
      var next_month = next_date.getMonth();
      var next_year = next_date.getFullYear();

      var next_date_str = next_day < 10 ? "0" + next_day : next_day;
      var next_month_str = next_month < 10 ? "0" + next_month : next_month;
      var date_str = next_date_str + "." + next_month_str;

      var weekday = next_date.getDay();
      var data = {
        key: i,
        is_today: today_date === next_day && today_month === next_month && today_year === today_year,
        ts: next_date_ts,
        weekday: weekday,
        weekday_str: WEEKDAY_NAMES[weekday],
        is_weekend: weekday === 0 || weekday === 6,
        day: next_day,
        month: next_month + 1,
        year: next_year,
        date_str: date_str,
        tasks: []
      };
      dates.push(data);
    }
    return dates;
  }

  service.init = function() {
  };

  return service;
}]);
