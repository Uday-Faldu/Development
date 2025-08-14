document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
  }

  if (!localStorage.getItem("couponApplied")) {
    localStorage.setItem("couponApplied", "false");
    localStorage.setItem("discountedTotal", "0");
  }

  function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartBody = document.getElementById("cart-body");
    let subtotal = 0;

    cartBody.innerHTML = "";

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4">Your cart is empty</td>
        </tr>
      `;
      document.getElementById("subtotal-amount").textContent = "$0";
      document.getElementById("total-amount").textContent = "$0";
      return;
    }

    cart.forEach((item, index) => {
      let qty = item.quantity ? parseInt(item.quantity) : 1;
      let itemSubtotal = item.price * qty;
      subtotal += itemSubtotal;

      cartBody.innerHTML += `
        <tr>
          <td><img src="${item.image}" alt="${item.name}" width="50" class="me-2"></td>
          <td class="text-start">${item.name}</td>
          <td>$${item.price}</td>
          <td>
            <input type="number" class="form-control form-control-sm text-center quantity-input"
              data-index="${index}" value="${qty}" min="1">
          </td>
          <td>$${itemSubtotal}</td>
          <td>
            <button class="btn btn-sm btn-danger remove-btn" data-index="${index}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });

    const couponApplied = localStorage.getItem("couponApplied") === "true";
    const discountedTotal = parseFloat(localStorage.getItem("discountedTotal"));

    document.getElementById("subtotal-amount").textContent = `$${subtotal}`;
    document.getElementById("total-amount").textContent = couponApplied
      ? `$${discountedTotal.toFixed(2)}`
      : `$${subtotal}`;

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        let index = this.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("couponApplied", "false");
        loadCart();
      });
    });

    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", function () {
        let index = this.dataset.index;
        let newQty = parseInt(this.value);
        if (newQty < 1) newQty = 1;
        cart[index].quantity = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("couponApplied", "false");
        loadCart();
      });
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

  document.querySelector(".btn-danger").addEventListener("click", function () {
    const couponInput = document
      .querySelector('input[placeholder="Coupon Code"]')
      .value.trim()
      .toUpperCase();
    const expectedCoupon = generateExpectedCoupon();
    const subtotalText = document.getElementById("subtotal-amount").textContent;
    const subtotal = parseFloat(subtotalText.replace("$", "")) || 0;

    if (couponInput === expectedCoupon) {
      const discountedTotal = (subtotal * 0.7).toFixed(2);
      document.getElementById(
        "total-amount"
      ).textContent = `$${discountedTotal}`;

      localStorage.setItem("couponApplied", "true");
      localStorage.setItem("discountedTotal", discountedTotal);

      alert("Coupon applied! 30% discount given.");
    } else {
      alert(`Invalid coupon.`);
    }
  });

  loadCart();
});
