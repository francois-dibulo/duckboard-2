/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
 * Returns random string which can be used for ids
 * @return {String}
 */
function randomId(chars) {
  chars = chars || 15;
  return (Math.random() + 1).toString(36).substring(2, chars);
}

/**
 * Returns random string which can be used for unique-ids.
 * @return {String}
 */
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function isMobile() {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) +min);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function parseQuery(qstr) {
  var query = {};
  var a = qstr.substr(1).split('&');
  for (var i = 0; i < a.length; i++) {
      var b = a[i].split('=');
      query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
  }
  return query;
}

// 18000000 = 5
// 93600000 = 26

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)));

  // hours_str = (hours < 10) ? "0" + hours : hours;
  // minutes_str = (minutes < 10) ? "0" + minutes : minutes;
  // seconds_str = (seconds < 10) ? "0" + seconds : seconds;

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}
