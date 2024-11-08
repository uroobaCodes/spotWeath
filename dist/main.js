import {
  showModal,
  toggleNav,
  handleFOUC,
  coordinatesMargin,
  handleScroll,
  navAndToggle,
  uvDisplay,
  closeListsOnScroll,
} from "./ui.js";

import apiModule from "./api.js";

// call the show modal when all of the dom content has been loaded
document.addEventListener("DOMContentLoaded", () => {
  showModal();
});

window.addEventListener("resize", handleFOUC);
document.addEventListener("DOMContentLoaded", handleFOUC);
window.addEventListener("scroll", navAndToggle);
window.addEventListener("resize", coordinatesMargin);
window.addEventListener("scroll", handleScroll);

//ui Module
toggleNav();
uvDisplay();
// formSubmission();
// comment out form submission because netlify will do this on its own

//api module
// commented this out because it was constantly asking location without clicking the button
// apiModule.geoFindMe();
apiModule.currentTime();
apiModule.currentWeather();
apiModule.weather();
apiModule.createHours();
apiModule.main();

// do I need farenheit as well?
//I cannot decide the font colors and logo colors
