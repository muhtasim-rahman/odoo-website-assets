/* ---------------------------------( Navbar positioning script )-------------------------------*/
// Especially for the 'mega nav icon' and 'search icon' to be aligned at the right side of the navbar.

document.addEventListener("DOMContentLoaded", function () {
  const buttonPrimary = document.querySelector(
    ".oe_unremovable.btn_cta.btn.btn-primary"
  );
  const buttonSecondary = document.querySelector(
    ".navbar .btn.rounded-circle.btn-outline-secondary"
  );
  const toggle = document.querySelector(".o_mega_menu_toggle");
  const navbar = document.querySelector(".navbar");
  const userMenu = document.querySelector(".dropdown-menu.js_usermenu"); // User menu to check sign-in status

  function positionToggle() {
    // Temporarily disable transition
    toggle.style.transition = "none";

    // Get the width of the navbar
    const navbarWidth = navbar.offsetWidth;

    if (!userMenu) {
      // Not signed in: position 43px to the left
      toggle.style.transform = `translateX(${
        navbarWidth - 837
      }px) translateY(0)`;
    } else {
      // Signed in: position like before
      toggle.style.transform = `translateX(${
        navbarWidth - 794
      }px) translateY(0)`;
    }

    // Force a reflow to apply the styles
    toggle.offsetHeight;

    // Re-enable the transition
    toggle.style.transition = "transform 0.21s ease";
  }

  if (userMenu) {
    // If signed in, add hover effects for both buttons
    buttonPrimary.addEventListener("mouseenter", function () {
      toggle.style.transform = `translateX(${
        navbar.offsetWidth - 794 - 10
      }px) translateY(0)`;
    });

    buttonPrimary.addEventListener("mouseleave", function () {
      toggle.style.transform = `translateX(${
        navbar.offsetWidth - 794
      }px) translateY(0)`;
    });

    buttonSecondary.addEventListener("mouseenter", function () {
      toggle.style.transform = `translateX(${
        navbar.offsetWidth - 794 - 30
      }px) translateY(0)`;
    });

    buttonSecondary.addEventListener("mouseleave", function () {
      toggle.style.transform = `translateX(${
        navbar.offsetWidth - 794
      }px) translateY(0)`;
    });
  } else {
    // If not signed in, add hover effect for the contact button (buttonPrimary)
    buttonPrimary.addEventListener("mouseenter", function () {
      toggle.style.transform = `translateX(${
        navbar.offsetWidth - 839 - 8
      }px) translateY(0)`;
    });

    buttonPrimary.addEventListener("mouseleave", function () {
      toggle.style.transform = `translateX(${
        navbar.offsetWidth - 839
      }px) translateY(0)`;
    });
  }

  // Run the function on page load and resize to ensure initial positioning
  window.addEventListener("load", positionToggle);
  window.addEventListener("resize", positionToggle);
});

/* --------------------------------( Custom Search bar scripts )--------------------------------- */

// ----------------------( Scripts for the function of the floating share buttons )-----------------------

// Function to get the current page URL
function getCurrentPageURL() {
  return window.location.href;
}

// Dummy text for sharing
const dummyText = encodeURIComponent("Check out this awesome website!");

// Share on Facebook
function shareOnFacebook() {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    getCurrentPageURL()
  )}&quote=${dummyText}`;
  window.open(facebookUrl, "_blank");
}

// Share on LinkedIn
function shareOnLinkedIn() {
  const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    getCurrentPageURL()
  )}&summary=${dummyText}`;
  window.open(linkedInUrl, "_blank");
}

// Share on Twitter (X)
function shareOnTwitter() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${dummyText}&url=${encodeURIComponent(
    getCurrentPageURL()
  )}`;
  window.open(twitterUrl, "_blank");
}

// Share on WhatsApp
function shareOnWhatsApp() {
  const whatsappUrl = `https://api.whatsapp.com/send?text=${dummyText}%20${encodeURIComponent(
    getCurrentPageURL()
  )}`;
  window.open(whatsappUrl, "_blank");
}

// Share on Telegram
function shareOnTelegram() {
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    getCurrentPageURL()
  )}&text=${dummyText}`;
  window.open(telegramUrl, "_blank");
}

// Share on Instagram
function shareOnInstagram() {
  // Show popup
  document.getElementById("instagram-popup").style.display = "block";

  // Set current page URL in the input field
  document.getElementById("current-page-link").value = getCurrentPageURL();
}

// Copy the link to clipboard
function copyLink() {
  const copyText = document.getElementById("current-page-link");
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices
  document.execCommand("copy");

  // Show the success message
  const message = document.getElementById("copy-success-message");
  message.style.opacity = "1";

  // Hide the message after 3 seconds
  setTimeout(() => {
    message.style.opacity = "0";
  }, 3000);
}

// Close the popup
function closePopup() {
  document.getElementById("instagram-popup").style.display = "none";
}

// ********************************************************

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-bar input");
  const searchButton = document.querySelector(".search-bar button");
  const resultsContainer = document.querySelector(".search-results");
  let currentFocus = -1;

  searchInput.addEventListener("input", function () {
    currentFocus = -1;
    performSearch();
  });

  searchButton.addEventListener("click", performSearch);

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      navigateResults(e);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentFocus >= 0) {
        const items = resultsContainer.querySelectorAll(".result-item");
        if (items[currentFocus]) {
          items[currentFocus].click();
        }
      }
    }
  });

  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();

    if (query === "") {
      resultsContainer.style.display = "none";
      resultsContainer.innerHTML = "";
      currentFocus = -1;
      return;
    }

    const queryWords = query.split(/\s+/);
    const contentRows = document.querySelectorAll(".s_media_list_item");
    const results = [];

    contentRows.forEach((row, index) => {
      let imgSrc = "";
      let titleText = "";
      let descriptionText = "";
      let imgAlt = "";

      // Check for iframe element (YouTube video)
      const videoElement = row.querySelector("iframe");
      if (videoElement) {
        const videoSrc = videoElement.src;
        const videoId = getYouTubeVideoId(videoSrc);
        if (videoId) {
          imgSrc = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          console.log(`Extracted YouTube thumbnail for video ID: ${videoId}`);
        } else {
          console.log("No YouTube video ID found for iframe src:", videoSrc);
        }
      }

      // Check for image element
      const imgElement = row.querySelector("img");
      if (imgElement && !videoElement) {
        imgSrc = imgElement.src;
        imgAlt = imgElement.alt || "";
        console.log(`Image found with src: ${imgSrc}`);
      }

      // Get title and description
      const titleElement = row.querySelector("h3");
      titleText = titleElement ? titleElement.textContent : "";

      const paragraphs = row.querySelectorAll("p");
      let combinedText = "";
      paragraphs.forEach((p) => {
        combinedText += p.textContent + " ";
      });

      // Scoring for relevance
      let score = 0;
      if (queryWords.every((word) => fuzzyMatch(titleText, word))) {
        score += 100;
      }
      if (queryWords.every((word) => fuzzyMatch(combinedText, word))) {
        score += 50;
      }

      if (score > 0) {
        results.push({
          row,
          index,
          score,
          imgSrc,
          titleText,
          combinedText,
          imgAlt,
        });
      }
    });

    results.sort((a, b) => b.score - a.score);

    displayResults(results);

    if (results.length > 0) {
      currentFocus = 0;
      const firstResultItem = resultsContainer.querySelector(".result-item");
      if (firstResultItem) {
        firstResultItem.classList.add("highlighted");
      }
    }
  }

  function displayResults(results) {
    resultsContainer.innerHTML = "";

    if (results.length === 0) {
      const noResultsMessage = document.createElement("div");
      noResultsMessage.classList.add("no-results-message");
      noResultsMessage.innerHTML = `
          <h3>No Results Found</h3>
          <p>Please type another keyword or <a href="https://mdturzo.odoo.com/contact">contact us</a>.</p>
        `;
      resultsContainer.appendChild(noResultsMessage);
      resultsContainer.style.display = "block";
      return;
    }

    resultsContainer.style.display = "block";

    results.forEach((result) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");
      resultItem.setAttribute("tabindex", "0");

      const truncatedTitle =
        result.titleText.length > 60
          ? result.titleText.substring(0, 60) + "..."
          : result.titleText;
      const truncatedDescription =
        result.combinedText.length > 175
          ? result.combinedText.substring(0, 175) + "..."
          : result.combinedText;
      const truncatedAlt =
        result.imgAlt.length > 50
          ? result.imgAlt.substring(0, 50) + "..."
          : result.imgAlt;

      // Check if imgSrc is available and set the image source properly
      const imgHtml = result.imgSrc
        ? `<img src="${result.imgSrc}" alt="${truncatedAlt}">`
        : `<img src="" alt="No image available">`;

      resultItem.innerHTML = `
          ${imgHtml}
          <div>
            <h3>${highlightText(truncatedTitle)}</h3>
            <p>${highlightText(truncatedDescription)}</p>
          </div>
        `;

      resultItem.addEventListener("click", () => {
        navigateToContent(result.index);
      });

      resultsContainer.appendChild(resultItem);
    });
  }

  function highlightText(text) {
    const query = searchInput.value.toLowerCase().trim();
    const queryWords = query.split(/\s+/);

    queryWords.forEach((word) => {
      const regex = new RegExp(word, "gi");
      text = text.replace(regex, '<span class="highlight">$&</span>');
    });

    return text;
  }

  function navigateToContent(index) {
    const rows = document.querySelectorAll(".s_media_list_item");
    rows.forEach((row) => {
      row.classList.remove("highlighted-row");
    });

    const rowElement = rows[index];
    rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
    rowElement.classList.add("highlighted-row");

    setTimeout(() => {
      rowElement.classList.remove("highlighted-row");
    }, 3000);
  }

  function navigateResults(e) {
    const items = resultsContainer.querySelectorAll(".result-item");

    if (e.key === "ArrowDown") {
      currentFocus++;
      if (currentFocus >= items.length) currentFocus = 0;
    } else if (e.key === "ArrowUp") {
      currentFocus--;
      if (currentFocus < 0) currentFocus = items.length - 1;
    }

    items.forEach((item) => item.classList.remove("highlighted"));
    if (items[currentFocus]) {
      items[currentFocus].classList.add("highlighted");
      items[currentFocus].scrollIntoView({ block: "nearest" });
    }
  }

  function fuzzyMatch(text, word) {
    text = text.toLowerCase();
    word = word.toLowerCase();
    return text.includes(word);
  }

  // Updated function to handle YouTube URLs from youtube-nocookie and youtube.com
  function getYouTubeVideoId(url) {
    const regex =
      /(?:youtube\.com\/embed\/|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
});

// ---------------------------------------
