//selectors from dom
const sidenav = document.getElementById("sidenav");
const content = document.getElementById("content");
const nav_icon = document.getElementById("nav-icon");

//event listeners
nav_icon.addEventListener("click", openCloseNav);

//functions
function openCloseNav() {
  nav_icon.classList.toggle('open');
  if (nav_icon.classList.contains('open')) {
    sidenav.style.width = "20em";
    content.style.marginLeft = "20em";
    document.getElementById("overlay").style.opacity = "0.4";
    //add links
    /*let linkOne = document.createElement("a");
    linkOne.appendChild(document.createTextNode("Impressum"));
    linkOne.href = "imprint.html";
    linkOne.setAttribute("id", "imprintLink");
    mySidenav.appendChild(linkOne);*/
  } else {
    sidenav.style.width = "7em";
    content.style.marginLeft = "7em";
    document.getElementById("overlay").style.opacity = "1";
    //remove links
    //document.getElementById("imprintLink").remove();
  }
}