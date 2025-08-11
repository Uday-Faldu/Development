function loadFooter() {
  // Calculate relative path to footer.html from current location
  let path = window.location.pathname;
  let depth = path.split("/").length - 2; // -2: remove empty and file name
  let rel = "";
  for (let i = 0; i < depth; i++) rel += "../";
  let footerPath = rel + "components/Footer/footer.html";
  fetch(footerPath)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("footer").innerHTML = html;
    })
    .catch((err) => console.error("Error loading footer:", err));
}
