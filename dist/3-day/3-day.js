function headerScroll() {
  const parallaxHeader = document.querySelector(".parallax-container");
  const img = document.querySelector(".img-container");
  const scrollY = window.scrollY;
  parallaxHeader.style.transform = `translateY(-${scrollY * 0.5}px)`;
  img.style.transform = `translateY(-${scrollY * 0.7}px)`;
}

function secondViewScroll() {
  const navbar = document.getElementById("navbar");
  const secondSection = document.querySelector(".second-section");

  // Calculate the current scroll position
  const scrollY = window.scrollY;

  // Get the height of the viewport and second section
  const windowHeight = window.innerHeight;
  const secondSectionTop = secondSection.getBoundingClientRect().top;

  // Start translating the second section upwards as the user scrolls down
  if (scrollY >= 10 && scrollY < secondSection.offsetTop + windowHeight) {
    secondSection.style.transform = `translateY(${-(scrollY - 50)}px)`;
  }
  if (secondSectionTop <= 0) {
    navbar.classList.add("visible");
  } else {
    navbar.classList.remove("visible");
  }
}

window.addEventListener("scroll", secondViewScroll);
window.addEventListener("scroll", headerScroll);

function caretEvent() {
  const caret = document.querySelector(".caret");
  const secondSection = document.querySelector(".second-section");
  caret.addEventListener("click", () => {
    window.scrollTo({
      top: secondSection.offsetTop,
      behavior: "smooth",
    });
  });
}
caretEvent();

function navToggle() {
  const navToggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".links");
  const linksContainer = document.querySelector(".links-container");

  navToggle.addEventListener("click", () => {
    const linksHeight = links.getBoundingClientRect().height;
    const containerMaxHeight = linksContainer.style.maxHeight;
    const buffer = 10;
    if (containerMaxHeight === "0px" || containerMaxHeight === "") {
      linksContainer.style.maxHeight = `${linksHeight + buffer}px`;
    } else {
      linksContainer.style.maxHeight = "0px";
    }
  }); //event listener

  // Close the links when scrolling on small screens
  window.addEventListener("scroll", () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 800) {
      linksContainer.style.maxHeight = "0px";
    }
  });

  //links height does not reset after interacting with toggle. Here is the reset on resize.
  window.addEventListener("resize", () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 800) {
      linksContainer.style.maxHeight = "none"; // Reset to default for larger screens
    } else {
      linksContainer.style.maxHeight = "0px"; // Collapse links for smaller screens
    }
  });
}

navToggle();

//fetch 3 day weather
async function fetchWeatherData() {
  const params = new URLSearchParams(window.location.search);
  const latitude = params.get("lat");
  const longitude = params.get("lon");
  try {
    const response = await fetch("/.netlify/functions/getData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const weatherData = data.weather;
    // const addressData = data.address;
    console.log(weatherData.forecast.forecastday);
    const threeDays = weatherData.forecast.forecastday;
    createThreeDivs(threeDays);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

fetchWeatherData();

function createThreeDivs(days) {
  console.log(days[0]);
  // set up the bar dates
  const dayOne = days[0];
  const dayTwo = days[2];

  const dayOneDate = new Date(dayOne.date_epoch * 1000);
  const dayTwoDate = new Date(dayTwo.date_epoch * 1000);

  const dayOneToday = String(dayOneDate.getDate()).padStart(2, "0");
  const dayTwoToday = String(dayTwoDate.getDate()).padStart(2, "0");

  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayOneMonth = monthsOfYear[dayOneDate.getMonth()]; // Get the full name of the month
  const dayTwoMonth = monthsOfYear[dayTwoDate.getMonth()];

  const dateOne = document.querySelector(".date-one");
  const dateTwo = document.querySelector(".date-two");
  const monthOne = document.querySelector(".month-one");
  const monthTwo = document.querySelector(".month-two");

  monthOne.textContent = `${dayOneMonth} `; //space necesary
  monthTwo.textContent = `${dayTwoMonth} `;
  dateOne.textContent = `${dayOneToday}`;
  dateTwo.textContent = `${dayTwoToday}`;

  // create three divs
  const container = document.querySelector(".child");
  container.innerHTML = "";

  days.forEach((day) => {
    // Get weather data for the current day
    const date = new Date(day.date_epoch * 1000);
    const dayIndex = date.getDay(); //0 - 6
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = daysOfWeek[dayIndex];
    const today = String(date.getDate()).padStart(2, "0"); // Adds leading zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adds 1 to the 0-11 range
    const maxTemp = day.day.maxtemp_c; // Adjust according to your API response
    const minTemp = day.day.mintemp_c;
    const conditionText = day.day.condition.text; // Weather condition text
    const conditionicon = day.day.condition.icon;
    const humid = day.day.avghumidity;
    const uvIndex = day.day.uv; // UV index value
    const sunrise = day.astro.sunrise; // Sunrise time
    const sunset = day.astro.sunset; // Sunset time
    const wind = day.day.maxwind_kph;

    // Set the inner HTML for the day div and adding the day-div wrapper

    const dayDiv = `
       <div class="wrapper-div"> 
            <div class="top-container"> 

              <div class="dd-mm-parent"> 
                <p class="day-caps">${dayName}</p>
                <p class="mm-dd"><span class="mm">${month}</span>/<span class="span dd">${today}</span>
                </p>
              </div>

              <div class="temp-parent"> 
                <img src="${conditionicon}" alt="weather image" class="icon">
                <p class="max-temp">${maxTemp}°</p>
                <p class="min-temp">${minTemp}°</p>
              </div>

              <div class="humidity-parent"> 
                <i class="fa-solid fa-droplet"></i>
                <p class="humid">${humid}%</p>
              </div>
            </div> 
            
            <div class="mid-container">
              <p class="mid-text">
                <span class="condition">${conditionText}</span> with UV
                <span class="uv">${uvIndex}</span>
                <span class="grade"></span>.
                <span class="protocol"></span>
              </p>
            </div> 

            <!-- bottom contianer -->
            <div class="bottom-container"> 

              <div class="first"> 
                <div class="sunrise"> 
                  <p>Sunrise:</p><p class="sunrise-time">${sunrise}</p>
                </div>

                <div class="sunset">
                  <p>Sunset:</p><p class="sunset-time">${sunset}</p>
                </div>
              </div> 

              <div class="second">
                <div class="uv-api"> 
                  <p>UV:</p> <p><span class="uv-num">${uvIndex}</span> <span class="uv-text"></span></p>
                </div>

                <div class="wind">
                  <p>Wind:</p> <p><span class="wind-num">${wind}kmh</span></p>
                </div>
              </div> 
            </div> 
        </div> 
      `;
    //last div is wrapper div. this will help with the top margins. check css.

    // Append the day div to the container
    // container.innerHTML += dayDiv;
    // OR
    container.innerHTML = container.innerHTML + dayDiv;

    //style the uv element
    const uvElement = container.querySelector(`.wrapper-div:last-child .uv`);
    const uvText = container.querySelector(`.wrapper-div:last-child .uv-text`);
    const uvNum = container.querySelector(`.wrapper-div:last-child .uv-num`);
    const protocolText = container.querySelector(
      `.wrapper-div:last-child .protocol`
    );
    const grade = container.querySelector(`.wrapper-div:last-child .grade`);
    const uvConditionText = container.querySelector(
      `.wrapper-div:last-child .condition`
    );

    //giving condition text some styling
    uvConditionText.style.fontWeight = "bold";
    uvConditionText.style.color = `#cac7e6`;

    // Determine UV color coding
    if (uvIndex >= 0 && uvIndex <= 2.9) {
      uvElement.style.color = `#1CA380`; //green
      grade.textContent = "Low";
      grade.style.color = `#1CA380`;
      uvText.textContent = "Low";
      uvText.style.color = `#1CA380`;
      uvNum.style.color = `#1CA380`;
      protocolText.textContent =
        "Nice and low. All you need is some sunscreen and sunglasses!";
    } else if (uvIndex >= 3 && uvIndex <= 5.9) {
      uvElement.style.color = `#F1C40F`; //yellow
      grade.textContent = "Medium";
      grade.style.color = `#F1C40F`;
      uvText.textContent = "Medium";
      uvText.style.color = `#F1C40F`;
      uvNum.style.color = `#F1C40F`;
      protocolText.textContent = `Take precautions. Apply sunscreen and wear sunglasses. Don't forget a hat!`;
    } else if (uvIndex >= 6 && uvIndex <= 7.9) {
      uvElement.style.color = `#E67E22`; //orange
      grade.textContent = "High";
      grade.style.color = `#E67E22`;
      uvText.textContent = "High";
      uvText.style.color = `#E67E22`;
      uvNum.style.color = `#E67E22`;
      protocolText.textContent = `Stay in shade. Grab your glasses and a hat. Don't forget to use sunscreen`;
    } else if (uvIndex >= 8 && uvIndex <= 10.9) {
      uvElement.style.color = `#E74C3C`; //red
      grade.textContent = "Very High";
      grade.style.color = `#E74C3C`;
      uvText.textContent = "Very High";
      uvText.style.color = `#E74C3C`;
      uvNum.style.color = `#E74C3C`;
      protocolText.textContent = `If you must go outside, wear some sunscreen and put on a hat with your sunglasses!`;
    } else if (uvIndex >= 11) {
      uvElement.style.color = `#8E44AD`; //purple
      grade.textContent = "Extreme";
      grade.style.color = `#8E44AD`;
      uvText.textContent = "Extreme";
      uvText.style.color = `#8E44AD`;
      uvNum.style.color = `#8E44AD`;
      protocolText.textContent = `Stay indoors between 10am - 4pm. To go outside, grab a water bottle, a hat, sunglasses and apply some sunscreen!`;
    } else {
      uvElement.style.color = `#9491af`;
    }
  });
}

// prevent default form submission
// netlify will handle form submission

// function formSubmission() {
//   const form = document.querySelector(".form");
//   const successMsg = document.querySelector(".success-msg");

//   form.addEventListener("submit", function (event) {
//     event.preventDefault(); // Prevents the page from reloading or navigating
//     successMsg.classList.add("show");
//     setTimeout(() => {
//       successMsg.classList.remove("show");
//     }, 2000);

//     // Clear the form inputs (reset the form fields)
//     form.reset();

//     // Temporarily disabling form submission for local testing
//     // form.submit(); (comment this out until you connect Netlify)
//     form.submit();
//   });
// }

// formSubmission();
