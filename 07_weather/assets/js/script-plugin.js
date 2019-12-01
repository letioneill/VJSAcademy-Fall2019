var getWeather = function (options) {

  //
  // Settings
  //

  // --------- Default Settings
  var defaults = {
    apiKey: null,
    selector: '#app',
    convertTemp: true,
    showFeels: true,
    showSunrise: true,
    showSunset: true,
    showVisibility: true,
    showWind: true,
    showHumidity: true,
    noWeather: 'Weather data is unavailable at the moment. Please try again later.',
    showIcon: true
  }

  // --------- Merge user options into default settings
  var settings = Object.assign(defaults, options);

  // --------- Variables
  // Get app variable
  var app = document.querySelector(settings.selector);

  // --------- Methods
  var sanitizeHTML = function (str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
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
  // -- Convert fahrenheit to celcius
  var fToC = function (temp) {
    if (settings.convertTemp) {
      return (parseFloat(temp) * 9 / 5) + 32;
    }

    // Return as is if not true
    return temp;
  };

  // -- Get icon for current weather
  var getIcon = function (weather) {
    if (!settings.showIcon) return '';

    // If true return the icon
    var html = 
      '<div class="temp-icon">' +
        '<image class="w-icon w-icon_' + weather.weather.icon + '" src="assets/img/w/' + weather.weather.icon +'.svg">' +
      '</div>';
    return html;
  }

  
  
  // --------- Render the weather data into the DOM
  var renderWeather = function (weather) {
    app.innerHTML =
      '<div class="temp">' +
        '<div class="location"><image src="assets/img/pin.svg">' + sanitizeHTML(weather.city_name) + ', ' + sanitizeHTML(weather.state_code) +'</div>' +
        '<div class="temp-wrapper">' +
          getIcon(weather) +
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

  // --------- Render message when there's no weather data
  var renderNoWeather = function () {
    app.innerHTML = settings.noWeather;
  }

  // --------- Don't run if no API Key provided in user settings
  if (!settings.apiKey) {
    console.warn('Please provide an API key.');
    return;
  }

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
      return fetch('https://api.weatherbit.io/v2.0/current?key=' + settings.apiKey + '&lat=' + data.latitude + '&lon=' + data.longitude);
    }).then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    }).then(function (data) {
      // Pass the first weather item into a helper function to render the UI
      renderWeather(data.data[0]);
    }).catch(function () {
      renderNoWeather();
    });

 };