// IIFE refactoring to avoid global namespace pollution and querying the DOM with every function because
// it is an expensive method to write code
const uiModule = (() => {
  const navToggle = document.querySelector(".nav-toggle");
  const linksContainer = document.querySelector(".links-container");
  const links = document.querySelector(".links");
  const myCoordinates = document.querySelector(".my-coordinates");

  function showModal() {
    const modal = document.querySelector(".modal-overlay");
    const closeBtn = document.querySelector(".close-btn");

    // Check if the modal has been shown before in this session
    if (!sessionStorage.getItem("modalShown")) {
      // Show modal after 1 second
      setTimeout(() => {
        modal.classList.add("open-modal");
      }, 1000);

      // Set the flag in sessionStorage to mark the modal as shown
      sessionStorage.setItem("modalShown", "true");
    }

    // Add event listener to close the modal when the close button is clicked
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("open-modal");
      // Hide modal with a delay to prevent it from immediately disappearing
      setTimeout(() => {
        modal.style.visibility = "hidden";
        modal.style.zIndex = "-10";
      }, 500);
    });
  }

  function toggleNav() {
    navToggle.addEventListener("click", () => {
      const linksHeight = links.getBoundingClientRect().height;
      // const containerHeight = linksContainer.getBoundingClientRect().height;
      const containerMaxHeight = linksContainer.style.maxHeight;
      const buffer = 10;
      if (window.innerWidth < 800) {
        if (containerMaxHeight === "0px" || containerMaxHeight === "") {
          linksContainer.style.maxHeight = `${linksHeight + buffer}px`;
          adjustCoordinatesPosition(linksHeight);
        } else {
          linksContainer.style.maxHeight = "0px";
          adjustCoordinatesPosition(0);
        }
      } else {
        linksContainer.style.maxHeight = null;
      }
    });

    // Add scroll event listener to close the links when scrolling
    window.addEventListener("scroll", () => {
      if (window.innerWidth < 800) {
        const containerHeight = linksContainer.getBoundingClientRect().height;
        // If the user scrolls and the links are open, close them
        if (containerHeight > 0) {
          linksContainer.style.maxHeight = "0";
          adjustCoordinatesPosition(0); // Reset coordinates position as well
        }
      }
    });
  }

  //links on small screen hide behind coordinates container
  function adjustCoordinatesPosition(navHeight) {
    if (window.innerWidth < 800) {
      myCoordinates.style.marginTop = `${navHeight}px`;
    } else {
      myCoordinates.style.marginTop = 0;
    }
  }

  // flash of unstyled content
  function handleFOUC() {
    if (window.innerWidth >= 800) {
      linksContainer.style.maxHeight = null;
    }
    // Hide links on smaller screens initially
    else {
      linksContainer.style.maxHeight = "0px";
    }
  }

  //check old coordinatesMargin in notes, I wrote it, this is chat gpt
  function coordinatesMargin() {
    const linksContainerHeight = linksContainer.getBoundingClientRect().height;
    if (window.innerWidth < 800) {
      if (linksContainerHeight > 0) {
        adjustCoordinatesPosition(linksContainerHeight);
      } else {
        adjustCoordinatesPosition(0); // If links are hidden, reset margin
      }
    } else {
      adjustCoordinatesPosition(0); // On larger screens, reset margin
    }
  }

  function navAndToggle() {
    const scrollHeight = window.scrollY;
    const topLink = document.querySelector(".top-link");
    if (scrollHeight > 500) {
      topLink.classList.add("show-link");
    } else {
      topLink.classList.remove("show-link");
    }
  }

  function handleScroll() {
    const scrollY = window.scrollY;
    myCoordinates.style.transform = `translate(-50%, calc(-50% - ${
      scrollY * 0.5
    }px))`;

    const linksContainerHeight = linksContainer.getBoundingClientRect().height;

    if (window.innerWidth > 800) {
      if (linksContainerHeight === 0) {
        linksContainer.style.maxHeight = "30px";
      }
    }
  }

  function uvDisplay() {
    let autoScrollCheck = false;
    let scrollTimer = null;
    const btns = document.querySelectorAll(".toggle-btn");

    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        autoScrollCheck = true;

        const target = e.currentTarget.dataset.id;
        const ulContainer = document.querySelector(target);
        // console.log('list child inide instruct container: ')
        // console.log(ulContainer)

        const ulParent = ulContainer.parentNode;
        // console.log('parent instruct container: ')
        // console.log(ulParent)

        const listHeight = ulContainer.getBoundingClientRect().height;
        const parentHeight = ulParent.getBoundingClientRect().height;
        // parent height is zero and list height is in pixels

        const allParents = document.querySelectorAll(".instruct");
        allParents.forEach((parent) => {
          const arrow = parent.previousElementSibling.querySelector("i");
          if (parent !== ulParent && parent.style.height !== 0) {
            parent.style.height = 0;
          }
          if (arrow.classList.contains("fa-arrow-up")) {
            arrow.classList.remove("fa-arrow-up");
            arrow.classList.add("fa-arrow-down");
          }
        });

        // expanding parent height and using setTimeout for auto-scrolling
        if (parentHeight <= 0) {
          ulParent.style.height = `${listHeight}px`;

          clearTimeout(scrollTimer);
          scrollTimer = setTimeout(() => {
            const scrollY = listHeight + window.scrollY;
            window.scrollTo({
              top: scrollY,
              left: 0,
              behavior: "smooth",
            });

            setTimeout(() => {
              autoScrollCheck = false;
            }, 1000);
          }, 100);
        } else {
          ulParent.style.height = 0;
        }
        // get the arrow icon of the btn clicked
        let arrowIcon = btn.querySelector("i");
        if (parentHeight <= 0) {
          arrowIcon.classList.remove("fa-arrow-down");
          arrowIcon.classList.add("fa-arrow-up");
        } else {
          arrowIcon.classList.remove("fa-arrow-up");
          arrowIcon.classList.add("fa-arrow-down");
        }
      }); //event listener on btn
    }); //for each loop on btns

    window.addEventListener("scroll", () => {
      // Only close the lists if we are not auto-scrolling
      if (!autoScrollCheck) {
        closeListsOnScroll();
      }
    });
  }

  function closeListsOnScroll() {
    // Select all parent elements with the class 'instruct'
    const allParents = document.querySelectorAll(".instruct");

    allParents.forEach((parent) => {
      const arrowIcon = parent.previousElementSibling.querySelector("i");
      // Close the list by setting height to 0
      if (parent.style.height !== 0) {
        parent.style.height = 0;
      }
      if (arrowIcon.classList.contains("fa-arrow-up")) {
        arrowIcon.classList.remove("fa-arrow-up");
        arrowIcon.classList.add("fa-arrow-down");
      }
    });
  } //closeListsOnScroll funciton

  // form submission handling

  function formSubmission() {
    const form = document.querySelector(".form");
    const successMsg = document.querySelector(".success-msg");

    form.addEventListener("submit", function (event) {
      // event.preventDefault(); // Prevents the page from reloading or navigating
      successMsg.classList.add("show");
      setTimeout(() => {
        successMsg.classList.remove("show");
      }, 2000);

      // Clear the form inputs (reset the form fields)
      form.reset();

      // Temporarily disabling form submission for local testing
      // form.submit(); (comment this out until you connect Netlify)
      // form.submit();
    });
  }

  return {
    showModal,
    toggleNav,
    adjustCoordinatesPosition,
    handleFOUC,
    coordinatesMargin,
    navAndToggle,
    handleScroll,
    uvDisplay,
    closeListsOnScroll,
    formSubmission,
  };
})(); //IIFE (Immediately Invoked Function Expression)

export const {
  showModal,
  toggleNav,
  adjustCoordinatesPosition,
  handleFOUC,
  coordinatesMargin,
  navAndToggle,
  handleScroll,
  uvDisplay,
  closeListsOnScroll,
  formSubmission,
} = uiModule;
