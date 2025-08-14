function loadHeader() {
  const rel = "../".repeat(window.location.pathname.split("/").length - 2);
  const headerPath = rel + "components/Header/header.html";

  fetch(headerPath)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("header").innerHTML = html;

      document
        .getElementById("signoff-link")
        ?.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.clear();
          location.href = rel + "index.html";
        });

      ["wishlist-link", "cart-link", "profile-link"].forEach((id) =>
        protectLink(id, rel)
      );

      updateCartCount();
      updateWishlistCount();
    })
    .catch((err) => console.error("Error loading header:", err));
}

function protectLink(id, rel) {
  document.getElementById(id)?.addEventListener("click", (e) => {
    if (!localStorage.getItem("userData")) {
      e.preventDefault();
      location.href = rel + "index.html";
    }
  });
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  el.textContent = total;
  el.style.display = total > 0 ? "block" : "none";
}

function updateWishlistCount() {
  const el = document.getElementById("wishlist-count");
  if (!el) return;

  const count = (JSON.parse(localStorage.getItem("favorites")) || []).length;
  el.textContent = count;
  el.style.display = count > 0 ? "block" : "none";
}

window.updateCartCount = updateCartCount;
window.updateWishlistCount = updateWishlistCount;
