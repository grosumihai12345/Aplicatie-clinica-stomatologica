// // verifică dacă utilizatorul este autentificat sau nu
// // înlocuiește condiția de mai jos cu codul tău pentru a verifica dacă utilizatorul este autentificat
// const isUserLoggedIn = true;

// // selectează butonul de login după id
// const loginButton = document.getElementById("login-btn");

// // dacă utilizatorul este autentificat, modifică textul butonului
// if (isUserLoggedIn) {
//   loginButton.textContent = "LOGOUT";

//   // adaugă un ascultător pentru evenimentul de clic pe butonul de logout
//   loginButton.addEventListener("click", async () => {
//     try {
//       // trimite o cerere de tip POST către ruta /logout pentru a șterge datele de sesiune ale utilizatorului
//       const response = await fetch("/logout", {
//         method: "POST",
//       });

//       // redirecționează utilizatorul către pagina de autentificare
//       window.location.href = "/login";
//     } catch (error) {
//       console.error(error);
//     }
//   });
// } else {
//   loginButton.textContent = "LOGIN";
// }
// Obtinem referinta catre butonul de login/logout si catre elementul de navigatie
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const navBar = document.getElementById("navbar");

// Verificam daca utilizatorul este autentificat sau nu
if (userIsLoggedIn()) {
  // Daca utilizatorul este autentificat, afisam butonul de logout si ascundem butonul de login
  logoutBtn.style.display = "block";
  loginBtn.style.display = "none";
} else {
  // Daca utilizatorul nu este autentificat, afisam butonul de login si ascundem butonul de logout
  loginBtn.style.display = "block";
  logoutBtn.style.display = "none";
}

// Functie de verificare a starii de autentificare a utilizatorului
function userIsLoggedIn() {
  // Aici putem verifica starea de autentificare a utilizatorului cum dorim
  // De exemplu, putem verifica daca utilizatorul are un token de autentificare valid in local storage
  return localStorage.getItem("authToken") !== null;
}
