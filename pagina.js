//functie care cauta cabinetele stomatologice din zona
const searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", () => {
  const location = "current location"; // sau adresa dvs. preferată
  const searchQuery = "cabinet stomatologic";
  const mapsUrl = `https://www.google.com/maps/search/${searchQuery}/@${location},12z`;
  window.open(mapsUrl, "_blank");
});

//functie care inchide bara de contact
document.getElementById("close-btn").addEventListener("click", function () {
  document.getElementById("contact-bar").classList.add("d-none");
});
