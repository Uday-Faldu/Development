function getStars(rating) {
  let stars = "";
  for (let i = 0; i < 5; i++) {
    stars +=
      i < rating
        ? '<span class="text-warning">&#9733;</span>'
        : '<span class="text-secondary">&#9733;</span>';
  }
  return stars;
}

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

fetch("products.json")
  .then((res) => res.json())
  .then((products) => {
    const container = document.getElementById("product-list");
    container.innerHTML = products
      .map((product) => {
        const isFavorite = favorites.some((item) => item.id === product.id);
        return `
        <div class="col-md-3 mb-4">
          <div class="card h-100 border-0 shadow-sm position-relative">
            <div class="position-absolute top-0 end-0 p-2 d-flex flex-column gap-2" style="display:none;">
              <button class="btn btn-light p-2 shadow-sm heart-btn rounded-5 ${
                isFavorite ? "bg-danger text-white" : ""
              }" data-product='${JSON.stringify(product)}'>
                <i class="${
                  isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart"
                }"></i>
              </button>
              <button class="btn btn-light p-2 shadow-sm">
                <i class="fa-regular fa-eye"></i>
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
                <span>${getStars(product.rating)}</span>
                <small class="text-muted">(${product.reviews})</small>
              </div>
            </div>
            
           <div class="card-footer bg-transparent border-0 fade w-100 add-to-cart-footer" style="transition: opacity 0.6s ease;">
              <button class="btn btn-dark w-100 add-to-cart-btn" data-product='${JSON.stringify(
                product
              )}'>Add to Cart</button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.querySelector(".add-to-cart-footer").classList.add("show");
        this.querySelector(".position-absolute").style.display = "flex";
      });
      card.addEventListener("mouseleave", function () {
        this.querySelector(".add-to-cart-footer").classList.remove("show");
        this.querySelector(".position-absolute").style.display = "none";
      });
    });

    document.addEventListener("click", function (e) {
      const heartBtn = e.target.closest(".heart-btn");
      if (heartBtn) {
        const product = JSON.parse(heartBtn.dataset.product);
        const icon = heartBtn.querySelector("i");
        const isFav = heartBtn.classList.contains("bg-danger");

        if (isFav) {
          favorites = favorites.filter((item) => item.id !== product.id);
          heartBtn.classList.remove("bg-danger", "text-white");
          icon.classList.replace("fa-solid", "fa-regular");
        } else {
          favorites.push(product);
          heartBtn.classList.add("bg-danger", "text-white");
          icon.classList.replace("fa-regular", "fa-solid");
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
        if (window.updateWishlistCount) updateWishlistCount();
      }
    });

    document.addEventListener("click", function (e) {
      const cartBtn = e.target.closest(".add-to-cart-btn");
      if (cartBtn) {
        const product = JSON.parse(cartBtn.dataset.product);
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
          product.quantity = 1;
          cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        if (window.updateCartCount) updateCartCount();
      }
    });

    if (window.updateCartCount) updateCartCount();
    if (window.updateWishlistCount) updateWishlistCount();
  })
  .catch((err) => console.error("Error loading products:", err));
