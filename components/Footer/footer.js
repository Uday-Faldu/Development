function loadFooter() {
  let path = window.location.pathname;
  let depth = path.split("/").length - 2; 
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
