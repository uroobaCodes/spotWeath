import {
  toggleNav,
  handleFOUC,
  coordinatesMargin,
  handleScroll,
  navAndToggle,
  uvDisplay,
  closeListsOnScroll,
  formSubmission,
} from "./ui.js";

import apiModule from "./api.js";

window.addEventListener("resize", handleFOUC);
document.addEventListener("DOMContentLoaded", handleFOUC);
window.addEventListener("scroll", navAndToggle);
window.addEventListener("resize", coordinatesMargin);
window.addEventListener("scroll", handleScroll);

//ui Module
toggleNav();
uvDisplay();
formSubmission();

//api module
// apiModule.geoFindMe();
apiModule.currentTime();
apiModule.currentWeather();
apiModule.weather();
apiModule.createHours();
apiModule.main();

// do I need farenheit as well?
//I cannot decide the font colors and logo colors
