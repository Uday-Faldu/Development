document.addEventListener("DOMContentLoaded", () => {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const container = document.createElement("div");
  container.className = "container mt-5";
   const wishlistProduct = document.getElementById("wishlistProduct");
  wishlistProduct.appendChild(container);
  if (favorites.length === 0) {
    container.innerHTML = `<div class="text-center text-muted my-5">
      <i class="fa-regular fa-heart fa-3x mb-3"></i>
      <p>Your wishlist is empty</p>
    </div>`;
    return;
  }

  const row = document.createElement("div");
  row.className = "row";
  container.appendChild(row);

  row.innerHTML = favorites
    .map(
      (product) => `
      <div class="col-md-3 mb-4">
        <div class="card h-100 border-0 shadow-sm position-relative">

          
          <div class="position-absolute top-0 end-0 p-2 d-flex flex-column gap-2" style="display:none;">
            <button class="btn btn-light p-2 shadow-sm trace-btn" data-product='${JSON.stringify(
              product
            )}'>
             <i class="fa-regular fa-trash-can"></i>
            </button>
           
          </div>

          <div class="bg-light d-flex justify-content-center align-items-center" style="height:220px;">
            <img src="${product.image}" class="card-img-top" alt="${
        product.name
      }" style="width:180px;height:200px;object-fit:contain;">
          </div>
          
          <div class="card-body">
            <h6 class="card-title">${product.name}</h6>
            <div class="d-flex align-items-center gap-2 mb-1">
              <p class="text-danger fw-bold mb-0">$${product.price}</p>
             
            </div>
          </div>
          
          <div class="card-footer bg-transparent border-0">
            <button class="btn btn-dark w-100 add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  document.addEventListener("click", function (e) {
    const traceBtn = e.target.closest(".trace-btn");
    if (traceBtn) {
      const product = JSON.parse(traceBtn.dataset.product);
      favorites = favorites.filter((item) => item.name !== product.name);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      traceBtn.closest(".col-md-3").remove();
    }
  });

  document.addEventListener("click", function (e) {
    const cartBtn = e.target.closest(".add-to-cart-btn");
    if (cartBtn) {
      const card = cartBtn.closest(".card");
      const productName = card.querySelector(".card-title").textContent;
      const product = favorites.find((p) => p.name === productName);

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  });
});
