document.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});

const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};


const getCurrentLocationWeather = async () => {
  try {
    const position = await getLocation();
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    await fetchWeatherData(latitude, longitude);
  } catch (error) {
    console.error('Error getting location or weather data:', error);
  }
};


getCurrentLocationWeather();


const fetchWeatherData = async (latitude, longitude) => {
  const apiKey = 'ffb6a6e9b50f41d900736a1f3e3940aa'; // Use your API key
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const weatherData = await response.json();
    
    updateData(weatherData)
    updateBgImg(weatherData.main.name)
    
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }

  
};





let city = document.getElementById("city");
let searchBtn = document.getElementById("search");
let url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
let apiKey = "&appid=66f5e8ce34d9f7a64a7c542b797897a4";
let weatherResult = document.getElementById("weather-result");
let temp = document.getElementById("temp");
let cityName = document.getElementById("city-name");
let humidity = document.getElementById("humidity-percentage");
let windSpeed = document.getElementById("wind-speed");
let weatherIcon = document.getElementById("weather-icon");
let weatherStatus = document.getElementById("status");
let splashScreen = document.getElementById("splash-screen");

async function updateBgImg(cityName) {
  const url = `https://api.unsplash.com/search/photos?query=${cityName} &client_id=lq8xBeS26k5j3IVA0nUubhhjeoVtKThZfCxhgFi_3BU`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const imageUrl = data.results[0].urls.full;
    container.style.backgroundImage = `url(${imageUrl})`;
  } catch (error) {
    console.error("Error fetching background image:", error);
  }
}

function updateData(data) {
  temp.innerHTML = Math.round(data.main.temp) + "°C";
  cityName.innerHTML = data.name;
  humidity.innerHTML = data.main.humidity + "%";
  windSpeed.innerHTML = Math.round(data.wind.speed * 3.6) + " Km/h";
;
  let weather = data.weather[0].main;
  weatherStatus.innerHTML =
    data.weather[0].description.toUpperCase() +
    " & IT'S FEELS LIKE " +
    parseInt(data.main.feels_like) +
    "°C";
  switch (weather) {
    case "Clouds":
      weatherIcon.src = "./images/cloudy.gif";
      break;
    case "Clear":
      weatherIcon.src = "./images/clear.gif";
      break;
    case "Drizzle":
      weatherIcon.src = "./images/drizzle.gif";
      break;
    case "Mist":
      weatherIcon.src = "./images/mist.png";
      break;
    case "Rain":
      weatherIcon.src = "./images/rain.gif";
      break;
    case "Haze":
      weatherIcon.src = "./images/haze.gif";
      break;
    case "Snow":
      weatherIcon.src = "./images/snow.gif";
      break;
    default:
      weatherIcon.src = "./images/clear.gif";
  }
}

async function getWeatherData() {
  try {
    const result = await fetch(url + city.value + apiKey);
    if (result.status === 404) {
      console.error("City not found");
      return;
    }

    const data = await result.json();
    updateData(data);
    updateBgImg(city.value);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Hide splash screen after 3 seconds
window.onload = function () {
  setTimeout(function () {
    splashScreen.style.opacity = "0";
    setTimeout(function () {
      splashScreen.style.display = "none";
    }, 1000); // Delay to match the fade-out transition
  }, 3000); // Show splash screen for 3 seconds
};


