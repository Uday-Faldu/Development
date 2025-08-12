function loadHeader() {
  let path = window.location.pathname;
  let depth = path.split("/").length - 2;
  let rel = "";
  for (let i = 0; i < depth; i++) rel += "../";
  let headerPath = rel + "components/Header/header.html";

  fetch(headerPath)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;

     
      const signOffLink = document.getElementById("signoff-link");
      if (signOffLink) {
        signOffLink.addEventListener("click", function (e) {
          e.preventDefault();
          localStorage.clear(); 
          window.location.href = rel + "index.html"; 
        });
      }
    })
    .catch((error) => console.error("Error loading header:", error));
}
