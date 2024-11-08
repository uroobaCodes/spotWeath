const apiModule = (() => {
  const addressBar = document.querySelector(".address");
  const latSpan = document.querySelector(".lat");
  const longSpan = document.querySelector(".long");
  const map = initMap();

  function geoFindMe() {
    addressBar.innerHTML = "loading...";
    latSpan.innerHTML = "loading...";
    longSpan.innerHTML = "loading...";

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      addressBar.innerHTML = `GeoLocation not supported by the browser`;
    }
  }

  async function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    latSpan.innerHTML = `${latitude}`;
    longSpan.innerHTML = `${longitude}`;

    try {
      const response = await fetch("/.netlify/functions/getData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      }); //fetch ends here

      if (!response.ok) {
        throw new Error(`Failed to fetch data, status: ${response.status}`);
      }
      const data = await response.json();
      // const { address, weather } = data;
      const addressData = data.address;
      const weatherData = data.weather;

      const addr = addressData.display_name;
      addressBar.innerHTML = `${addr}`;
      updateMap(latitude, longitude, addr);
      redirectToForecastPage(latitude, longitude);
      const days = weatherData.forecast.forecastday;
      createHours(days);
      currentWeather(days);
    } catch (error) {
      latSpan.innerHTML = `Error: ${error.message}`;
      longSpan.innerHTML = `Error: ${error.message}`;
      addressBar.innerHTML = `Error: Unable to load data. Please try again later.`;
    }
  } //success function

  function error(err) {
    // no need to query the address bar again, use global reference
    // const addressBar = document.querySelector(".address");
    addressBar.innerHTML = `Error ${err.code}: ${err.message}`;
  }

  //making the 3-day url with coordinates
  function redirectToForecastPage(latitude, longitude) {
    const forecastBtn = document.getElementById("getForecastBtn");
    forecastBtn.addEventListener("click", (event) => {
      // Prevent the default link action
      event.preventDefault();

      // Construct the URL with the coordinates as query parameters
      const newUrl = `./3-day/3-day.html?lat=${latitude}&lon=${longitude}`;

      // Redirect the user to the new URL
      window.location.href = newUrl;
    });
  }

  //this deals with getting the current time
  function currentTime() {
    const currentTimeP = document.querySelector(".current-time p");
    const todayDate = new Date();
    let hours = todayDate.getHours();
    let minutes = todayDate.getMinutes();

    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;

    currentTimeP.textContent = `${hours}:${minutes}`;
  }
  currentTime();
  //1 second for setInterval
  setInterval(currentTime, 1000);

  //this deals with current day data
  function currentWeather(days) {
    if (!days || days.length === 0) {
      console.error("Days array is undefined or empty");
      return; // Prevent further execution if data is missing
    }

    const conditionIconImg = document.querySelector(".condition-icon img");
    const conditionNum = document.querySelector(".condition-num p");
    const conditionCelsius = document.querySelector(".condition-celsius p");
    const conditionText = document.querySelector(".condition-text p");
    //Wind
    const windValue = document.querySelector(
      ".small .day:nth-child(1) .value p"
    );
    //Humidity
    const humidityValue = document.querySelector(
      ".small .day:nth-child(2) .value p"
    );
    //UV Index
    const uvValue = document.querySelector(
      ".small .day:nth-child(3) .uv-value a"
    );
    const currentDay = days[0];
    // console.log(`days parameter in currentWeather func:`)
    // console.log(days)

    conditionIconImg.src = `${currentDay.day.condition.icon}`;
    conditionNum.textContent = `${currentDay.day.maxtemp_c}`;
    // conditionCelsius = `${}`;
    conditionText.textContent = `${currentDay.day.condition.text}`;

    //Wind
    windValue.textContent = `${currentDay.day.maxwind_kph}kph`;

    //Humidity
    humidityValue.textContent = `${currentDay.day.avghumidity}%`;

    //UV Index
    // uvValue.textContent = `${currentDay.day.uv}`;
    const uvValueAPI = currentDay.day.uv;

    switch (true) {
      case uvValueAPI >= 0 && uvValueAPI <= 2:
        uvValue.style.color = "green";
        uvValue.style.textDecoration = "underline";
        uvValue.style.textDecorationColor = "green";
        uvValue.textContent = `${currentDay.day.uv}`;
        break;
      case uvValueAPI >= 3 && uvValueAPI <= 5:
        uvValue.style.color = "yellow";
        uvValue.style.textDecoration = "underline";
        uvValue.style.textDecorationColor = "yellow";
        uvValue.textContent = `${currentDay.day.uv}`;
        break;
      case uvValueAPI >= 6 && uvValueAPI <= 7:
        uvValue.style.color = "orange";
        uvValue.style.textDecoration = "underline";
        uvValue.style.textDecorationColor = "orange";
        uvValue.textContent = `${currentDay.day.uv}`;
        break;
      case uvValueAPI >= 8 && uvValueAPI <= 10:
        uvValue.style.color = "red";
        uvValue.style.textDecoration = "underline";
        uvValue.style.textDecorationColor = "red";
        uvValue.textContent = `${currentDay.day.uv}`;
        break;
      case uvValueAPI >= 11:
        uvValue.style.color = "purple";
        uvValue.style.textDecoration = "underline";
        uvValue.style.textDecorationColor = "purple";
        uvValue.textContent = `${currentDay.day.uv}`;
        break;
      default:
        uvValue.style.color = `#9491af`;
        uvValue.style.textDecoration = "underline";
        uvValue.style.textDecorationColor = `#9491af`;
        uvValue.textContent = `${currentDay.day.uv}`;
    }
  }

  function initMap() {
    const map = L.map("map").setView([51.505, -0.09], 13); // Creates and returns a Leaflet map instance.
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map); // Adds the tile layer to the map.
    return map; // Returns the map object.
  }

  function updateMap(lat, lon, address) {
    // Center the map on the new position
    map.setView([lat, lon], 13);

    // Add a marker to the map
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(`<b>Address:</b><br>${address}`)
      .openPopup();
  }

  function createHours(days) {
    if (!days || days.length === 0) {
      console.error("Days array is undefined or empty");
      return; // Prevent further execution if data is missing
    }

    const btnNext = document.querySelector(".next");
    const btnPrev = document.querySelector(".previous");
    const hourContainer = document.querySelector(".tfour_hours");
    const currentHour = new Date().getHours();

    function getHoursForDay(index) {
      //.hour is the api object
      return days[index].hour;
    }

    let dayIndex = 0;
    let hours = getHoursForDay(dayIndex);
    let index = currentHour;
    let displayHours = [];

    for (let i = 0; i < 12; i++) {
      // console.log(hours)
      // console.log(`index: ${index}`)
      let hourData = hours[index];
      let hourNum = index < 10 ? `0${index}` : index;

      if (index === 0) {
        displayHours.push(`
                    <div class="hour-${i} child">
                        <p class="next-day">Next Day</p>
                        <p class="next-hour-num">${hourNum}</p>
                        <img class="icon" src="https:${hourData.condition.icon}" alt="icon">
                        <p class="temp">${hourData.temp_c}°C</p>
                    </div>
                `);
      } else {
        displayHours.push(`
                    <div class="hour-${i} child">
                        <p class="hour-num">${hourNum}</p>
                        <img class="icon" src="https:${hourData.condition.icon}" alt="icon">
                        <p class="temp">${hourData.temp_c}°C</p>
                    </div>
                `);
      }

      index = (index + 1) % 24;
      if (index === 0 && dayIndex === 0) {
        dayIndex = 1;
        hours = getHoursForDay(dayIndex);
      }
    } //for loop

    displayHours = displayHours.join("");
    hourContainer.innerHTML = displayHours;

    const children = document.querySelectorAll(".child");
    let currentOffset = 0;

    children.forEach((child, index) => {
      child.style.left = `${index * 20}%`;
    });

    function updateTranslate(direction) {
      const margins = getComputedStyle(children[0]).marginRight;
      const itemWidth = children[0].offsetWidth + parseFloat(margins);
      const containerWidth = hourContainer.offsetWidth;
      let maxOffset = children.length * itemWidth - containerWidth;

      if (direction === "next") {
        currentOffset = Math.min(currentOffset + itemWidth, maxOffset);
        hourContainer.style.transform = `translateX(-${currentOffset}px)`;
      } else if (direction === "prev") {
        // Move to the left, but stop at the first item
        currentOffset = Math.max(currentOffset - itemWidth, 0);
        hourContainer.style.transform = `translateX(-${currentOffset}px)`;
      }
    } //function update translate

    btnNext.addEventListener("click", () => updateTranslate("next"));
    btnPrev.addEventListener("click", () => updateTranslate("prev"));

    window.addEventListener("resize", () => {
      currentOffset = 0; // Reset the offset
      hourContainer.style.transform = `translateX(0px)`; // Reset the position
      updateTranslate(); // Recalculate item widths, etc.
    });
  } //createHours func

  function main() {
    const btn = document.querySelector(".btn");
    btn.addEventListener("click", geoFindMe);
  }

  main();

  return {
    geoFindMe,
    currentTime,
    currentWeather,
    redirectToForecastPage,
    createHours,
    main,
  };
})();

export default apiModule;
