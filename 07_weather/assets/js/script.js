(function () {
  // --------- Variables
  var apiKey = 'aa294306b6e744c683ba3ae4a74fb531';
  var app = document.querySelector('#app');

  // --------- Methods
  var sanitizeHTML = function (str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  };
  // -- Convert fahrenheit to celcius
  var fToC = function (temp) {
    return (parseFloat(temp) * 9 / 5) + 32;
  };

  // -- Convert celcius to farenheit
  var cToF = function (temp) {
    return (parseFloat(temp - 32) * 5 / 9);
  };

  var kToM = function (dist) {
    return (parseFloat(dist) * 0.62137);
  }

  var mToS = function (speed) {
    return (parseFloat(speed) * 2.23694)
  }

  // --------- Render the weather data into the DOM
  var renderWeather = function (weather) {
    app.innerHTML =
      '<div class="temp">' +
        '<div class="location"><image src="assets/img/pin.svg">' + sanitizeHTML(weather.city_name) + ', ' + sanitizeHTML(weather.state_code) +'</div>' +
        '<div class="temp-wrapper">' +
          '<div class="temp-icon">' +
            '<image class="w-icon w-icon_' + weather.weather.icon + '" src="assets/img/w/' + weather.weather.icon +'.svg">' +
          '</div>' +
          '<div class="temp-deg">' +
            '<span class="temp-now">' + Math.round(fToC(sanitizeHTML(weather.temp))) + '</span>' +
            '<span class="temp-desc">' + sanitizeHTML(weather.weather.description).toLowerCase() + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<ul class="details">' +
        '<li><span><image class="d-icon" src="assets/img/feels.svg">' + Math.round(fToC(sanitizeHTML(weather.app_temp))) + '<small>&deg;</small></span>Feels like</li>' +
        '<li><span><image class="d-icon" src="assets/img/sunrise.svg">' + sanitizeHTML(weather.sunrise) + '</span>Sunrise</li>' +
        '<li><span><image class="d-icon" src="assets/img/sunset.svg">' + sanitizeHTML(weather.sunset) + '</span>Sunset</li>' +
        '<li><span><image class="d-icon" src="assets/img/visibility.svg">' + Math.round(kToM(weather.vis)) + ' mi' + ' </span>Visibility</li>' +
        '<li><span><image class="d-icon" src="assets/img/wind.svg">' + Math.round(kToM(weather.wind_spd)) + ' mi' + '</span>Wind ' + weather.wind_cdir + '</li>' +
        '<li><span><image class="d-icon" src="assets/img/humidity.svg">' + Math.round(kToM(weather.rh)) + '%' + '</span>Humidity</li>' +
      '</ul>';
    var body = document.querySelector('#weather');
    body.classList.add(sanitizeHTML(weather.pod) + '-time');
  };

  // --------- Init
  fetch('https://ipapi.co/json').then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    }).then(function (data) {
      // Pass data into another API request
      // Then, return the new Promise into the stream
      return fetch('https://api.weatherbit.io/v2.0/current?key=' + apiKey + '&lat=' + data.latitude + '&lon=' + data.longitude);
    }).then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    }).then(function (data) {
      // Pass the first weather item into a helper function to render the UI
      renderWeather(data.data[0]);
    }).catch(function (error) {
      // Show an error message
      app.textContent = 'Unable to get weather data at this time.';
      console.warn(error);
    });

 })();