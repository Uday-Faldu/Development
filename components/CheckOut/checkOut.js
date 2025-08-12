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
      <strong id="total-amount">$${subtotal}</strong>
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
      <input type="text" class="form-control" placeholder="Coupon Code" id="coupon-code">
    </div>
    <div class="col-4">
      <button class="btn btn-danger w-100" id="apply-coupon">Apply Coupon</button>
    </div>
  </div>

  <button class="btn btn-danger w-25 mt-3">Place Order</button>
  `;

  summaryHTML += `</div>`;

  document.getElementById("cart-summary").innerHTML = summaryHTML;

  // Coupon logic
  document
    .getElementById("apply-coupon")
    .addEventListener("click", function () {
      let couponInput = document.getElementById("coupon-code").value.trim();

      // Get user name from localStorage
      let userData = JSON.parse(localStorage.getItem("user")) || {};
      let first4 = userData.name
        ? userData.name.substring(0, 4).toUpperCase()
        : "";

      // Financial year (April–March)
      let now = new Date();
      let year =
        now.getMonth() + 1 >= 4 ? now.getFullYear() : now.getFullYear() - 1;
      let finYear = `${year}-${(year + 1).toString().slice(-2)}`;

      // Month abbreviation
      let monthNames = [
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
      ];
      let month3 = monthNames[now.getMonth()];

      // Expected coupon
      let expectedCoupon = `${first4}DEVIT${finYear}${month3}`;

      if (couponInput.toUpperCase() === expectedCoupon) {
        let discountedTotal = (subtotal * 0.7).toFixed(2);
        document.getElementById(
          "total-amount"
        ).textContent = `$${discountedTotal}`;
        alert("Coupon applied! 30% discount given.");
      } else {
        alert("Invalid coupon code.");
      }
    });
});
