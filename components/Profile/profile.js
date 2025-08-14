document.addEventListener("DOMContentLoaded", function () {
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData) {
    alert("No user data found. Please login first.");
    window.location.href = "../../index.html";
    return;
  }

  const form = document.getElementById("profileForm");

  document.getElementById("firstName").value = userData.firstName || "";
  document.getElementById("lastName").value = userData.lastName || "";
  document.getElementById("email").value = userData.email || "";
  document.getElementById("address").value = userData.address || "";
  document.getElementById("country").value = userData.country || "";
  document.getElementById("state").value = userData.state || "";
  document.getElementById("city").value = userData.city || "";
  document.getElementById("mobileNumber").value = userData.phone || "";

  if (userData.gender) {
    const genderInput = document.querySelector(
      `input[name="gender"][value="${userData.gender}"]`
    );
    if (genderInput) genderInput.checked = true;
  }

  if (userData.interests) {
    userData.interests.forEach((interest) => {
      const checkbox = document.getElementById(interest.toLowerCase());
      if (checkbox) checkbox.checked = true;
    });
  }

  function validateName(name) {
    return /^[A-Za-z\s]+$/.test(name);
  }

  function validateMobile(mobile) {
    const cleaned = mobile.replace(/\D/g, "");
    return /^\d{10}$/.test(cleaned);
  }

  function validatePassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
      password
    );
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(elementId, errorId, message) {
    const element = document.getElementById(elementId);
    const errorElement = document.getElementById(errorId);

    if (element && errorElement) {
      element.classList.add("is-invalid");
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  }

  function clearAllErrors() {
    document.querySelectorAll(".error-message").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(".is-invalid").forEach((el) => {
      el.classList.remove("is-invalid");
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearAllErrors();

    let isValid = true;

    const validateField = (fieldId, errorId, validator, errorMessage) => {
      const value = document.getElementById(fieldId).value.trim();
      if (!value || (validator && !validator(value))) {
        showError(fieldId, errorId, errorMessage);
        return false;
      }
      return true;
    };

    isValid =
      validateField(
        "firstName",
        "firstNameError",
        validateName,
        "First name is required (letters only)"
      ) && isValid;

    isValid =
      validateField(
        "lastName",
        "lastNameError",
        validateName,
        "Last name is required (letters only)"
      ) && isValid;

    isValid =
      validateField(
        "email",
        "emailError",
        validateEmail,
        "Valid email is required"
      ) && isValid;

    isValid =
      validateField("address", "addressError", null, "Address is required") &&
      isValid;

    isValid =
      validateField("country", "countryError", null, "Country is required") &&
      isValid;

    isValid =
      validateField("state", "stateError", null, "State is required") &&
      isValid;

    isValid =
      validateField("city", "cityError", null, "City is required") && isValid;

    isValid =
      validateField(
        "mobileNumber",
        "mobileError",
        validateMobile,
        "Valid 10-digit mobile number required"
      ) && isValid;
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
      showError("male", "genderError", "Please select your gender");
      isValid = false;
    }

    const interestsChecked = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    if (interestsChecked.length === 0) {
      const errorElement = document.getElementById("interestsError");
      errorElement.style.display = "block";
      isValid = false;
    }

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        showError(
          "currentPassword",
          "currentPasswordError",
          "Current password is required"
        );
        isValid = false;
      } else if (currentPassword !== userData.password) {
        showError(
          "currentPassword",
          "currentPasswordError",
          "Current password is incorrect"
        );
        isValid = false;
      }

      if (!newPassword) {
        showError(
          "newPassword",
          "newPasswordError",
          "New password is required"
        );
        isValid = false;
      } else if (!validatePassword(newPassword)) {
        showError(
          "newPassword",
          "newPasswordError",
          "Password must be 8+ chars with 1 letter, 1 digit, 1 special char"
        );
        isValid = false;
      }

      if (!confirmPassword) {
        showError(
          "confirmPassword",
          "confirmPasswordError",
          "Please confirm password"
        );
        isValid = false;
      } else if (newPassword !== confirmPassword) {
        showError(
          "confirmPassword",
          "confirmPasswordError",
          "Passwords don't match"
        );
        isValid = false;
      }
    }

    if (isValid) {
      const updatedUserData = {
        ...userData,
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        address: document.getElementById("address").value.trim(),
        country: document.getElementById("country").value.trim(),
        state: document.getElementById("state").value.trim(),
        city: document.getElementById("city").value.trim(),
        gender: gender ? gender.value : "",
        phone: document
          .getElementById("mobileNumber")
          .value.trim()
          .replace(/\D/g, ""),
        interests: Array.from(
          document.querySelectorAll('input[type="checkbox"]:checked')
        ).map((checkbox) => checkbox.value),
      };

      if (newPassword) {
        updatedUserData.password = newPassword;
      }

      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      alert("Profile updated successfully!");
    } else {
      const firstError = document.querySelector(".is-invalid");
      if (firstError) {
        firstError.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  });

  document.getElementById("cancelBtn").addEventListener("click", function () {
    window.location.reload();
  });
});
