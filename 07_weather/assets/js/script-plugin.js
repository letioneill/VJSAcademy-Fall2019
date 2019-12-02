var getWeather = function (options) {

  //
  // Settings
  //

  // --------- Default Settings
  var defaults = {
    apiKey: null,
    selector: '#app',
    convertTemp: true,
    location: '{{city}}, {{state}}',
    description: '{{description}}',
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

  // -- Convert fahrenheit to celcius
  var fToC = function (temp) {
    if (settings.convertTemp) {
      return (parseFloat(temp) * 9 / 5) + 32;
    }

    // Return as is if not true
    return temp;
  };

  // -- Kilometers to Miles
  var kToM = function (dist) {
    return (parseFloat(dist) * 0.62137);
  }


  var mToS = function (speed) {
    return (parseFloat(speed) * 2.23694)
  }

  // -- Get Icon
  var getIcon = function (weather) {
    if (!settings.showIcon) return '';

    // If true return the icon
    var html = 
      '<div class="temp-icon">' +
        '<image class="w-icon w-icon_' + weather.weather.icon + '" src="assets/img/w/' + weather.weather.icon +'.svg">' +
      '</div>';
    return html;
  };

  // -- Get Location
  var getLocation = function (weather) {
    return settings.location
      .replace('{{city}}', sanitizeHTML(weather.city_name))
      .replace('{{state}}', sanitizeHTML(weather.state_code));
  };

  // -- Get Description
  var getDescription = function (weather) {
    return settings.description
      .replace('{{description}}', sanitizeHTML(weather.weather.description).toLowerCase());
  };

  // -- Get Feels Temp
  var getFeels = function (weather) {
    if (!settings.showFeels) return '';
    var html = 
      '<li><span><image class="d-icon i-feels" src="assets/img/feels.svg">' + Math.round(fToC(sanitizeHTML(weather.app_temp))) + '<small>&deg;</small></span>Feels like</li>';
    return html;
  };

  // - Get Sunrise Time
  var getSunrise = function (weather) {
    if (!settings.showSunrise) return '';
    var html = 
      '<li><span><image class="d-icon i-sunrise" src="assets/img/sunrise.svg">' + sanitizeHTML(weather.sunrise) + '</span>Sunrise</li>';
    return html;
  };

  // - Get Sunset Time
  var getSunset = function (weather) {
    if (!settings.showSunset) return '';
    var html = 
      '<li><span><image class="d-icon i-sunset" src="assets/img/sunset.svg">' + sanitizeHTML(weather.sunset) + '</span>Sunset</li>';
    return html;
  };

  // - Get Visibility Distance
  var getVis = function (weather) {
    if (!settings.showVisibility) return '';
    var html = 
      '<li><span><image class="d-icon i-vis" src="assets/img/visibility.svg">' + Math.round(kToM(sanitizeHTML(weather.vis))) + ' mi' + ' </span>Visibility</li>';
    return html;
  };

  // -- Get Wind speed and direction
  var getWind = function (weather) {
    if (!settings.showWind) return '';
    var html =
      '<li><span><image class="d-icon i-wind" src="assets/img/wind.svg">' + Math.round(kToM(weather.wind_spd)) + ' mi' + '</span>Wind ' + weather.wind_cdir + '</li>';
    return html;
  };

  // -- Get Humidity percentage
  var getHumidity = function (weather) {
    if (!settings.showHumidity) return '';
    var html =
      '<li><span><image class="d-icon i-humid" src="assets/img/humidity.svg">' + Math.round(kToM(weather.rh)) + '%' + '</span>Humidity</li>';
    return html;
  }

  
  // --------- Render the weather data into the DOM
  var renderWeather = function (weather) {
    app.innerHTML =
      '<div class="temp">' +
        '<div class="location"><image src="assets/img/pin.svg">' + getLocation(weather) +'</div>' +
        '<div class="temp-wrapper">' +
          getIcon(weather) +
          '<div class="temp-deg">' +
            '<span class="temp-now">' + Math.round(fToC(sanitizeHTML(weather.temp))) + '</span>' +
            '<span class="temp-desc">' + getDescription(weather) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<ul class="details">' +
        getFeels(weather) +
        getSunrise(weather) +
        getSunset(weather) +
        getVis(weather) +
        getWind(weather) +
        getHumidity(weather) +
      '</ul>';

    // -- Add Class to body for part of day value
    var body = document.querySelector('#weather');
    body.classList.add(sanitizeHTML(weather.pod) + '-time');

    // -- Add to UL with number of children
    var detailUl = document.querySelectorAll(".details");
    var detailItems = Array.prototype.slice.call(document.querySelectorAll(".d-icon"));
    var detailNums = detailItems.length;
    detailUl[0].classList.add("detail-" + detailNums);

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
