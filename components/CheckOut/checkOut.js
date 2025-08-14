document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;

  let summaryHTML = `<div class="small mx-auto" style="max-width: 500px;">`;

  cart.forEach((item) => {
    let qty = item.quantity ? parseInt(item.quantity) : 1;
    let total = item.price * qty;
    subtotal += total;

    summaryHTML += `
    <div class="d-flex justify-content-between align-items-center mb-2 mt-3">
      <div class="d-flex align-items-center">
        <img src="${item.image}" alt="${item.name}" class="me-5" style="width:35px; height:auto;">
        <div>${item.name}</div>
      </div>
      <div>$${total}</div>
    </div>
  `;
  });

  const couponApplied = localStorage.getItem("couponApplied") === "true";
  const discountedTotal =
    parseFloat(localStorage.getItem("discountedTotal")) || subtotal;

  summaryHTML += `
    <div class="d-flex justify-content-between border-bottom pb-3 pt-3">
      <span>Subtotal:</span>
      <strong>$${subtotal}</strong>
    </div>
    <div class="d-flex justify-content-between border-bottom pb-3 pt-3">
      <span>Shipping:</span>
      <span>Free</span>
    </div>

    <div class="d-flex justify-content-between pt-3">
      <span>Total:</span>
      <strong id="total-amount">$${
        couponApplied ? discountedTotal.toFixed(2) : subtotal
      }</strong>
    </div>

    <div class="mt-3">
      <div class="d-flex align-items-center justify-content-between w-100">
        <div class="form-check m-0">
          <input class="form-check-input" type="radio" name="payment" id="bank">
          <label class="form-check-label" for="bank">Bank</label>
        </div>
        <div>
          <img src="/assests/Images/Bkash.png" alt="" style="height:25px" />
          <img src="/assests/Images/Visa.png" alt="" style="height:25px" />
          <img src="/assests/Images/Mastercard.png" alt="" style="height:25px" />
          <img src="/assests/Images/Nagad.png" alt="" style="height:25px" />
        </div>
      </div>

      <div class="form-check mt-2">
        <input class="form-check-input" type="radio" name="payment" id="cod" checked>
        <label class="form-check-label" for="cod">Cash on delivery</label>
      </div>
    </div>

    <div class="row g-2 mt-3">
      <div class="col-8">
        <input type="text" class="form-control" placeholder="Coupon Code" id="coupon-code" 
          ${couponApplied ? "disabled" : ""}>
      </div>
      <div class="col-4">
        <button class="btn btn-danger w-100" id="apply-coupon" 
          ${couponApplied ? "disabled" : ""}>
          ${couponApplied ? "Applied" : "Apply Coupon"}
        </button>
      </div>
    </div>

    <button class="btn btn-danger w-25 mt-3 placeorderBtn">Place Order</button>
  `;

  summaryHTML += `</div>`;
  document.getElementById("cart-summary").innerHTML = summaryHTML;

  if (!couponApplied) {
    document
      .getElementById("apply-coupon")
      .addEventListener("click", function () {
        const couponInput = document
          .getElementById("coupon-code")
          .value.trim()
          .toUpperCase();
        const currentExpectedCoupon = generateExpectedCoupon();

        if (couponInput === currentExpectedCoupon) {
          const newDiscountedTotal = (subtotal * 0.7).toFixed(2);
          document.getElementById(
            "total-amount"
          ).textContent = `$${newDiscountedTotal}`;

          localStorage.setItem("couponApplied", "true");
          localStorage.setItem("discountedTotal", newDiscountedTotal);

          document.getElementById("coupon-code").disabled = true;
          this.disabled = true;
          this.textContent = "Applied";

          alert("Coupon applied successfully! 30% discount has been applied.");
        } else {
          alert(
            `Invalid coupon code. The correct code should be: ${currentExpectedCoupon}`
          );
        }
      });
  }

  function generateExpectedCoupon() {
    let userData;
    try {
      userData = JSON.parse(localStorage.getItem("user")) || {};
    } catch (e) {
      userData = {};
    }

    const username = userData.name || "emilys";
    const first4 = username.substring(0, 4).toUpperCase();

    const now = new Date();
    const currentYear = now.getFullYear();
    const year = now.getMonth() + 1 >= 4 ? currentYear : currentYear - 1;
    const finYear = `${year.toString().slice(-2)}${(year + 1)
      .toString()
      .slice(-2)}`;
    const month3 = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ][now.getMonth()];

    return `${first4}DEVIT${finYear}${month3}`;
  }

  const placeOrderBtn = document.querySelector(".placeorderBtn");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (validateForm()) {
        const orderData = {
          customerDetails: {
            firstName: document.getElementById("firstName").value.trim(),
            companyName: document.getElementById("companyName").value.trim(),
            streetAddress: document
              .getElementById("streetAddress")
              .value.trim(),
            apartment: document.getElementById("apartment").value.trim(),
            townCity: document.getElementById("townCity").value.trim(),
            phoneNumber: document.getElementById("phoneNumber").value.trim(),
            email: document.getElementById("email").value.trim(),
            saveInfo: document.getElementById("saveInfo").checked,
          },
          cartItems: JSON.parse(localStorage.getItem("cart")) || [],
          paymentMethod: document.querySelector('input[name="payment"]:checked')
            .id,
          couponApplied: localStorage.getItem("couponApplied") === "true",
          orderDate: new Date().toISOString(),
          orderTotal: document
            .getElementById("total-amount")
            .textContent.replace("$", ""),
          orderStatus: "Pending",
        };

        let orders = JSON.parse(localStorage.getItem("orders")) || [];

        orders.push(orderData);

        localStorage.setItem("orders", JSON.stringify(orders));

        localStorage.removeItem("cart");
        localStorage.removeItem("couponApplied");
        localStorage.removeItem("discountedTotal");

        alert("Order placed successfully!");
      } else {
        const requiredFields = document.querySelectorAll(
          "#billing-form input[required]"
        );
        requiredFields.forEach((field) => {
          const event = { target: field };
          validateField(event);
        });
      }
    });
  }

  const requiredFields = document.querySelectorAll(
    "#billing-form input[required]"
  );
  requiredFields.forEach((field) => {
    field.addEventListener("blur", validateField);
    field.addEventListener("input", clearError);
  });

  function validateField(e) {
    const field = e.target;
    const errorId = field.id + "-error";
    const errorElement = document.getElementById(errorId);

    if (!field.value.trim()) {
      field.classList.add("is-invalid");
      if (errorElement) {
        errorElement.textContent = `${field.labels[0].textContent
          .replace("*", "")
          .trim()} is required`;
        errorElement.style.display = "block";
      }
      return false;
    }

    if (field.id === "firstName") {
      if (!/^[a-zA-Z]+$/.test(field.value.trim())) {
        field.classList.add("is-invalid");
        if (errorElement) {
          errorElement.textContent = "First name must contain only letters";
          errorElement.style.display = "block";
        }
        return false;
      }
    }

    if (field.id === "streetAddress") {
      if (field.value.trim().length < 5) {
        field.classList.add("is-invalid");
        if (errorElement) {
          errorElement.textContent =
            "Street address must be at least 5 characters";
          errorElement.style.display = "block";
        }
        return false;
      }
    }

    if (field.id === "townCity") {
      if (!/^[a-zA-Z\s]+$/.test(field.value.trim())) {
        field.classList.add("is-invalid");
        if (errorElement) {
          errorElement.textContent = "City must contain only letters";
          errorElement.style.display = "block";
        }
        return false;
      }
    }

    if (field.id === "phoneNumber") {
      if (!/^\d{10}$/.test(field.value.trim())) {
        field.classList.add("is-invalid");
        if (errorElement) {
          errorElement.textContent = "Phone number must be exactly 10 digits";
          errorElement.style.display = "block";
        }
        return false;
      }
    }

    if (field.id === "email" && !isValidEmail(field.value)) {
      field.classList.add("is-invalid");
      if (errorElement) {
        errorElement.textContent = "Please enter a valid email";
        errorElement.style.display = "block";
      }
      return false;
    }

    field.classList.remove("is-invalid");
    if (errorElement) errorElement.style.display = "none";
    return true;
  }

  function clearError(e) {
    const field = e.target;
    const errorId = field.id + "-error";
    const errorElement = document.getElementById(errorId);

    if (field.value.trim()) {
      field.classList.remove("is-invalid");
      if (errorElement) errorElement.style.display = "none";
    }
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll(
      "#billing-form input[required]"
    );

    requiredFields.forEach((field) => {
      const event = { target: field };
      if (!validateField(event)) {
        isValid = false;
      }
    });

    return isValid;
  }
});
