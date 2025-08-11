function loadHeader() {
  // Calculate relative path to header.html from current location
  let path = window.location.pathname;
  let depth = path.split('/').length - 2; // -2: remove empty and file name
  let rel = '';
  for (let i = 0; i < depth; i++) rel += '../';
  let headerPath = rel + 'components/Header/header.html';
  fetch(headerPath)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;
    })
    .catch((error) => console.error("Error loading header:", error));
}
