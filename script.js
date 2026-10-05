const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

const form = document.getElementById("registrationForm");
const statusBox = document.getElementById("formStatus");

const provinceWrap = document.getElementById("provinceWrap");
const provinceInput = document.getElementById("province");

// ========================================
// DARK / LIGHT MODE
// ========================================

const savedTheme = localStorage.getItem("sss-demo-theme");
const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

setTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

function setTheme(theme) {
  root.dataset.theme = theme;

  const isDark = theme === "dark";

  themeIcon.textContent = isDark ? "☀" : "☾";
  themeLabel.textContent = isDark ? "Light" : "Dark";

  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${isDark ? "light" : "dark"} mode`
  );
}

themeToggle.addEventListener("click", () => {
  const nextTheme =
    root.dataset.theme === "dark" ? "light" : "dark";

  setTheme(nextTheme);

  localStorage.setItem("sss-demo-theme", nextTheme);
});

// ========================================
// METRO MANILA / PROVINCE
// ========================================

document
  .querySelectorAll('input[name="locationType"]')
  .forEach((radio) => {

    radio.addEventListener("change", () => {

      const provinceMode =
        radio.checked &&
        radio.value === "province";

      provinceWrap.classList.toggle(
        "hidden",
        !provinceMode
      );

      provinceInput.required = provinceMode;

      if (!provinceMode) {
        provinceInput.value = "";
        clearError(provinceInput);
      }
    });

  });

// ========================================
// CRN / SS NUMBER
// NUMBERS ONLY
// ========================================

document
  .getElementById("crn")
  .addEventListener("input", (event) => {

    event.target.value =
      event.target.value.replace(/\D/g, "");

  });

// ========================================
// ERROR HELPERS
// ========================================

function getErrorElement(input) {

  return document.querySelector(
    `[data-error-for="${input.id}"]`
  );

}

function showError(input, message) {

  input.classList.add("invalid");

  input.setAttribute(
    "aria-invalid",
    "true"
  );

  const error = getErrorElement(input);

  if (error) {
    error.textContent = message;
  }

}

function clearError(input) {

  input.classList.remove("invalid");

  input.removeAttribute("aria-invalid");

  const error = getErrorElement(input);

  if (error) {
    error.textContent = "";
  }

}

// ========================================
// REQUIRED FIELD VALIDATION
// ========================================

function required(input, label) {

  if (!input.value.trim()) {

    showError(
      input,
      `${label} is required.`
    );

    return false;
  }

  return true;
}

// ========================================
// MAIN FORM VALIDATION
// ========================================

function validateForm() {

  let valid = true;

  // Clear previous errors
  const inputs = form.querySelectorAll("input");

  inputs.forEach(clearError);

  // Get form fields
  const crn =
    document.getElementById("crn");

  const email =
    document.getElementById("email");

  const confirmEmail =
    document.getElementById("confirmEmail");

  const userId =
    document.getElementById("userId");

  const confirmUserId =
    document.getElementById("confirmUserId");

  const lastName =
    document.getElementById("lastName");

  const givenName =
    document.getElementById("givenName");

  const birthDate =
    document.getElementById("birthDate");


  // ========================================
  // CRN / SS NUMBER
  // ========================================

  if (!required(crn, "CRN / SS Number")) {

    valid = false;

  } else if (!/^\d{8,12}$/.test(crn.value)) {

    showError(
      crn,
      "Enter 8 to 12 digits."
    );

    valid = false;
  }


  // ========================================
  // EMAIL
  // ========================================

  if (!required(email, "Email address")) {

    valid = false;

  } else if (!email.validity.valid) {

    showError(
      email,
      "Enter a valid email address."
    );

    valid = false;
  }


  // ========================================
  // CONFIRM EMAIL
  // ========================================

  if (
    !required(
      confirmEmail,
      "Email confirmation"
    )
  ) {

    valid = false;

  } else if (
    email.value.trim().toLowerCase() !==
    confirmEmail.value.trim().toLowerCase()
  ) {

    showError(
      confirmEmail,
      "Email addresses do not match."
    );

    valid = false;
  }


  // ========================================
  // USER ID
  // ========================================

  if (!required(userId, "Preferred User ID")) {

    valid = false;

  } else if (
    !/^[A-Za-z][A-Za-z0-9_]{7,19}$/.test(
      userId.value
    )
  ) {

    showError(
      userId,
      "Use 8–20 characters, start with a letter, and use only letters, numbers or underscore."
    );

    valid = false;
  }


  // ========================================
  // CONFIRM USER ID
  // ========================================

  if (
    !required(
      confirmUserId,
      "User ID confirmation"
    )
  ) {

    valid = false;

  } else if (
    userId.value !== confirmUserId.value
  ) {

    showError(
      confirmUserId,
      "User IDs do not match."
    );

    valid = false;
  }


  // ========================================
  // NAME
  // ========================================

  if (!required(lastName, "Last name")) {
    valid = false;
  }

  if (!required(givenName, "Given name")) {
    valid = false;
  }


  // ========================================
  // DATE OF BIRTH
  // ========================================

  if (!required(birthDate, "Date of birth")) {
    valid = false;
  }


  // ========================================
  // PROVINCE
  // ========================================

  if (
    provinceInput.required &&
    !required(provinceInput, "Province")
  ) {

    valid = false;
  }


  return valid;
}

// ========================================
// FORM SUBMISSION
// ========================================

form.addEventListener("submit", (event) => {

  event.preventDefault();

  statusBox.className = "status";

  // Validate form
  if (!validateForm()) {

    statusBox.textContent =
      "Please review the highlighted fields.";

    statusBox.classList.add(
      "show",
      "error"
    );

    // Focus first invalid field
    form
      .querySelector(".invalid")
      ?.focus();

    return;
  }


  // Successful validation
  statusBox.textContent =
    "Form validated successfully. This demo does not send data to a server.";

  statusBox.classList.add(
    "show",
    "success"
  );

});

// ========================================
// RESET FORM
// ========================================

form.addEventListener("reset", () => {

  requestAnimationFrame(() => {

    // Remove errors
    form
      .querySelectorAll("input")
      .forEach(clearError);

    // Clear status
    statusBox.className = "status";
    statusBox.textContent = "";

    // Hide province
    provinceWrap.classList.add("hidden");

    provinceInput.required = false;

  });

});