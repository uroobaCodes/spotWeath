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

// traversing the dom
function revealAns() {
  const btns = document.querySelectorAll(".question-btn");
  const quesitons = document.querySelectorAll(".question");

  btns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      const btnParentQuestion = e.currentTarget.parentElement.parentElement;

      quesitons.forEach((question) => {
        if (question !== btnParentQuestion) {
          question.classList.remove("show-text");
        }
      });
      btnParentQuestion.classList.toggle("show-text");
    });
  });
}
revealAns();

function wordCount() {
  const textArea = document.getElementById("message");

  textArea.addEventListener("keydown", (e) => {
    const realTime = document.querySelector(".real-time");
    const inputVal = textArea.value;
    const maxWords = 100;
    const words = inputVal.trim().split(" ");
    const newWords = words.filter((word) => word !== "");
    realTime.innerHTML = `${newWords.length}`;

    if (newWords.length > maxWords) {
      console.log(
        `the allowed ${maxWords}, you have exceeded the limit by ${
          newWords.length - maxWords
        }`
      );
      let newSentence = newWords.slice(0, maxWords);
      const brandNew = newSentence.join(" ");
      textArea.value = brandNew;
      if (
        newWords.length >= maxWords &&
        e.key !== "Backspace" &&
        e.key !== "Delete" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight"
      ) {
        e.preventDefault(); // Prevent further typing
      }
    }
  });
}
wordCount();

// prevent default form submission

function formSubmission() {
  const form = document.querySelector(".form");
  const successMsg = document.querySelector(".success-msg");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents the page from reloading or navigating
    successMsg.classList.add("show");
    setTimeout(() => {
      successMsg.classList.remove("show");
    }, 2000);

    // Clear the form inputs (reset the form fields)
    form.reset();

    // Temporarily disabling form submission for local testing
    // form.submit(); (comment this out until you connect Netlify)
    form.submit();
  });
}

formSubmission();
