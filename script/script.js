const apiKey = "011e7a2b2238ebed1860f534850e7af4"; 
const apiUnsplashKey = "P5wMAOUehrHdBzztSmAj2jmibdLo0PnNan5c0H8kiUE";


const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");
const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const umidityElement = document.querySelector("#umidity span");
const windElement = document.querySelector("#wind span");
const weatherContainer = document.querySelector("#weather-data");
const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");
const suggestionContainer = document.querySelector("#suggestions");


const toggleLoader = () => {
  loader.classList.toggle("hide");
};
const suggestionButtons = document.querySelectorAll("#suggestions button");
const getWeatherData = async (city) => {
  toggleLoader();
  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  try {
    const res = await fetch(apiWeatherURL);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados do clima:', error);
    return { cod: "404" }; 
  } finally {
    toggleLoader();
  }
};

const getBackgroundImage = async (city) => {
  const apiUnsplashURL = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&client_id=${apiUnsplashKey}`;
  try {
    const res = await fetch(apiUnsplashURL);
    const data = await res.json();
    const imageUrl = data.results[0]?.urls?.regular || "default-image-url"; 
    return imageUrl;
  } catch (error) {
    console.error('Erro ao buscar imagem de fundo:', error);
    return "default-image-url";
  }
};

const getRandomCities = () => {
  const cities = [
    "New York", "London", "Tokyo", "Paris", "Berlin", "Sydney", "Rio de Janeiro", 
    "Moscow", "Beijing", "Cape Town", "Berlin", "Brasilia", "Liverpool", 
    "Rome", "Madrid", "Toronto", "San Francisco", "Los Angeles", "Dubai", 
    "Singapore", "Hong Kong", "Amsterdam", "Vienna", "Copenhagen", "Stockholm", 
    "Zurich", "Geneva", "Frankfurt", "Osaka", "Maceió", "Buenos Aires"
  ];
  
  const randomCities = [];
  
  while (randomCities.length < 3) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    if (!randomCities.includes(city)) {
      randomCities.push(city);
    }
  }
  
  return randomCities;
};

const showErrorMessage = () => {
  errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
  errorMessageContainer.classList.add("hide");
  weatherContainer.classList.add("hide");
  suggestionContainer.classList.add("hide");
};

const showWeatherData = async (city) => {
  hideInformation();
  const data = await getWeatherData(city);

  if (data.cod === "404") {
    showErrorMessage();
    return;
  }

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  countryElement.setAttribute("src", `https://flagcdn.com/16x12/${data.sys.country.toLowerCase()}.png`);
  umidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`; 

  const backgroundImageUrl = await getBackgroundImage(city);
  document.body.style.backgroundImage = `url("${backgroundImageUrl}")`;

  
  const randomCities = getRandomCities();
  suggestionContainer.innerHTML = ''; 

  randomCities.forEach((suggestedCity) => {
    const btn = document.createElement('button');
    btn.innerText = suggestedCity;
    btn.setAttribute('id', suggestedCity);
    btn.addEventListener("click", () => {
      cityInput.value = ''; 
      showWeatherData(suggestedCity);
    });
    suggestionContainer.appendChild(btn);
  });

  suggestionContainer.classList.remove("hide");
  weatherContainer.classList.remove("hide");
};


searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    showWeatherData(city);
  }
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value.trim();
    if (city) {
      showWeatherData(city);
    }
  }
});

suggestionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.getAttribute("id");

    showWeatherData(city);
  });
});


window.onload = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  console.log(`Latitude: ${lat}, Longitude: ${lon}`);
}

function error() {
  alert("Não foi possível obter sua localização.");
}
