document.addEventListener("DOMContentLoaded", function () {
  function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartBody = document.getElementById("cart-body");
    let subtotal = 0;

    cartBody.innerHTML = "";

    cart.forEach((item, index) => {
      let qty = item.quantity ? parseInt(item.quantity) : 1;
      let itemSubtotal = item.price * qty;
      subtotal += itemSubtotal;

      cartBody.innerHTML += `
        <tr>
          <td><img src="${item.image}" alt="${item.name}" width="50" class="me-2"></td>
          <td class="text-start">
            
            ${item.name}
          </td>
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

    document.getElementById("subtotal-amount").textContent = `$${subtotal}`;
    document.getElementById("total-amount").textContent = `$${subtotal}`;

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        let index = this.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
      });
    });

    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", function () {
        let index = this.dataset.index;
        cart[index].quantity = parseInt(this.value);
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
      });
    });
  }

  document.getElementById("update-cart").addEventListener("click", loadCart);
  loadCart();
});
