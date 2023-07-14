const express = require("express"); // Importăm modulul Express
const session = require("express-session"); //Se importă modulul Express Session pentru a gestiona sesiunile utilizatorilor.
const app = express(); //Se creează o instanță a aplicației Express.
const mongoose = require("mongoose"); //Importarea modulului Mongoose pentru conectarea la baza de date MongoDB
const bcrypt = require("bcrypt"); //Importarea modulului bcrypt pentru criptarea parolelor
const User = require("./models/user");
const Programare = require("./models/programare");
const helper = require("./common/helper");
const saltRounds = 10;
const { google } = require("googleapis"); // Importăm modulul `google` din pachetul `googleapis`
const { oauth2 } = require("googleapis/build/src/apis/oauth2"); // Importăm modulul `oauth2` din pachetul `googleapis`
const { v4: uuid } = require("uuid"); // Importăm funcția `uuid` din pachetul `uuid`
const dayjs = require("dayjs"); // Importăm modulul `dayjs`
const axios = require("axios"); // Importăm modulul `axios` pentru efectuarea de cereri HTTP
require("dotenv").config(); // Adăugăm această linie pentru a încărca variabilele de mediu din fișierul .env
const calendar = google.calendar({
  // Inițializăm clientul de calendar Google
  version: "v3",
  auth: process.env.API_KEY, // Utilizăm cheia de autentificare din variabilele de mediu
});

const PORT = process.env.NODE_ENV || 3000; // Portul pe care va rula serverul, preluat din variabilele de mediu sau valoarea implicită 3000

const oauth2Client = new google.auth.OAuth2( // Inițializăm clientul OAuth2
  process.env.CLIENT_ID, // ID-ul clientului din variabilele de mediu
  process.env.CLIENT_SECRET, // Secretul clientului din variabilele de mediu
  process.env.REDIRECT_URI // URI-ul de redirecționare din variabilele de mediu
);
const scopes = ["https://www.googleapis.com/auth/calendar"]; // Scopurile pentru autorizarea OAuth2

// Adăugăm middleware pentru a procesa corpul cererilor POST (formularele de autentificare vor fi trimise prin POST)
app.use(express.urlencoded({ extended: true }));
//analizează cererile POST de tip JSON și le transformă în obiecte JSON accesibile în cererea req.body
app.use(express.json());
// Setează folderul pentru fișierele statice
app.use(express.static(__dirname));
// Utilizăm sesiuni pentru a gestiona starea utilizatorilor autentificați
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
//Setarea motorului de vizualizare pentru șabloanele EJS
app.set("view engine", "ejs");

// Conectăm baza de date MongoDB
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/site");
}
// Apelăm funcția main() pentru a realiza conexiunea cu baza de date
main().catch((err) => console.log(err));

// Definim ruta pentru pagina de login (accesată prin GET)
app.get("/login", (req, res) => {
  // Verifică dacă utilizatorul este autentificat
  const isLoggedIn = req.session && req.session.user;
  // Returnează pagina de login, trimițând informația despre autentificare către aceasta
  res.render("login", { isLoggedIn });
});

// Definim ruta pentru procesarea formularului de login (accesată prin POST)
app.post("/login", async (req, res) => {
  // Obținem datele din formular
  let { email, password } = req.body;
  // Verificăm dacă există email-ul și parola
  if (!email || !password) {
    res.status(400).send("Please provide an email and password");
    return;
  }
  try {
    // Căutăm utilizatorul în baza de date
    const user = await User.findOne({ email });
    console.log(`user: ${user}`);
    // Dacă utilizatorul nu este găsit, trimitem un mesaj de eroare
    if (!user) {
      res.status(401).send("Invalid email or password");
      return;
    }
    // Comparam parola introdusă cu parola stocată în baza de date
    const isMatch = await bcrypt.compare(password, user.password);
    // Dacă parolele nu se potrivesc, trimitem un mesaj de eroare
    if (!isMatch) {
      res.status(401).send("Invalid email or password");
      return;
    }
    // Adăugăm informații despre utilizator în sesiunea curentă
    req.session.user = user;
    // Redirecționăm utilizatorul spre pagina /istoric-programari
    res.redirect("/istoric-programari");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Funcția de middleware pentru a verifica autentificarea utilizatorului
function requireLogin(req, res, next) {
  // Verificăm dacă există o sesiune și dacă utilizatorul este autentificat în aceasta
  if (req.session && req.session.user) {
    // Dacă utilizatorul este autentificat, trecem la următoarea rută
    next();
  } else {
    // Dacă utilizatorul nu este autentificat, redirecționăm către pagina de login
    res.redirect("/login");
  }
}

// Obține lista de servicii oferite
app.get("/servicii", (req, res) => {
  // Verifică dacă utilizatorul este autentificat
  const isLoggedIn = req.session && req.session.user;
  // Returnează pagina de programare, trimițând informația despre autentificare către aceasta
  res.render("servicii", { isLoggedIn });
});

// Obține pagina de tarife
app.get("/tarife", (req, res) => {
  // Verifică dacă utilizatorul este autentificat
  const isLoggedIn = req.session && req.session.user;
  // Returnează pagina de programare, trimițând informația despre autentificare către aceasta
  res.render("tarife", { isLoggedIn });
});

// Obține pagina principala
app.get("/ai", (req, res) => {
  // Verifică dacă utilizatorul este autentificat
  const isLoggedIn = req.session && req.session.user;
  // Returnează pagina de programare, trimițând informația despre autentificare către aceasta
  res.render("ai", { isLoggedIn });
});

app.get("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  // Verifică dacă utilizatorul este autentificat
  const isLoggedIn = req.session && req.session.user;
  // Returnează pagina de programare, trimițând informația despre autentificare către aceasta
  res.render("register", { isLoggedIn });
});

// Înregistrarea unui nou utilizator
app.post("/register", async (req, res) => {
  // Obținerea informațiilor despre username, password și email din corpul cererii
  let { username, password, email } = req.body;
  // Verificarea dacă username, password și email au fost furnizate
  if (!username || !password || !email) {
    res.status(400).send("Please provide a username, password, and email");
    return;
  }
  // Generarea unui salt pentru criptarea parolei
  const salt = await bcrypt.genSalt(saltRounds);
  // Criptarea parolei folosind salt-ul generat
  let hash = await bcrypt.hash(password, salt);
  // Crearea unui nou obiect User cu informațiile furnizate
  let newUser = new User({
    username,
    password: hash,
    email,
  });
  try {
    // Salvarea utilizatorului în baza de date
    const savedUser = await newUser.save();
    console.log("User saved:", savedUser);
  } catch (err) {
    console.error(err);
  }
  // Redirecționarea către pagina de autentificare
  res.redirect("/login");
});

// Obține pagina de programare
app.get("/programare", (req, res) => {
  // Verifică dacă utilizatorul este autentificat
  const isLoggedIn = req.session && req.session.user;
  // Returnează pagina de programare, trimițând informația despre autentificare către aceasta
  res.render("programare", { isLoggedIn });
});

// Ruta pentru înregistrarea unei programări, cererea trebuie să fie autentificată
app.post("/programare", requireLogin, async (req, res) => {
  const { data, ora, tratament, nume, prenume, telefon } = req.body;
  // Verificăm dacă datele de intrare sunt în formatul corect
  if (!data || !ora || isNaN(Date.parse(data + "T" + ora))) {
    res.status(400).send("Datele de intrare sunt invalide");
    return;
  }

  // Verificăm dacă există deja o programare la aceeași oră și dată
  const existingProgramare = await Programare.findOne({
    data: new Date(data + "T" + ora),
  });
  if (existingProgramare) {
    res.status(409).send("Exista deja o programare la aceeași oră și dată");
    return;
  }
  try {
    // Căutăm utilizatorul curent în baza de date
    const user = await User.findById(req.session.user._id);
    if (!user) {
      res.status(401).send("Utilizatorul nu a putut fi găsit");
      return;
    }
    // Creăm un nou obiect Programare folosind datele din formular
    const programare = new Programare({
      prenume: req.body.prenume,
      nume: req.body.nume,
      telefon: req.body.telefon,
      tratament: req.body.tratament,
      data: new Date(req.body.data + "T" + req.body.ora),
      ora: req.body.ora,
      user: user._id,
    });
    // Salvăm obiectul programare în baza de date
    const savedProgramare = await programare.save();
    const stateParams = {
      data: req.body.data,
      ora: req.body.ora,
      tratament: req.body.tratament,
    };
    // Obținem URL-ul pentru autorizarea OAuth2
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: JSON.stringify(stateParams),
    });
    // Redirecționăm utilizatorul către URL-ul de autorizare OAuth2
    res.redirect(url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Programarea nu a putut fi realizată!");
  }
});

// Ruta pentru redirecționarea după autorizarea OAuth2
app.get("/google/redirect", async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  // Parse the state parameter to retrieve the custom parameters
  const stateParams = JSON.parse(state);
  const { data, ora, tratament } = stateParams;

  try {
    // Obținem token-ul de autorizare
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // Căutăm utilizatorul curent în baza de date
    const user = await User.findById(req.session.user._id);
    if (!user) {
      res.status(401).send("Utilizatorul nu a putut fi găsit");
      return;
    }
    // Adăugăm o oră la data și ora specificate
    const startDateTime = dayjs(new Date(`${data}T${ora}`)).toISOString();
    const endDateTime = dayjs(new Date(`${data}T${ora}`))
      .add(1, "hour")
      .toISOString();

    console.log(startDateTime);
    // Creăm evenimentul în Google Calendar
    await calendar.events.insert({
      calendarId: "primary",
      auth: oauth2Client,
      requestBody: {
        summary: `Programare la dentist `,
        description: `Programare pentru ${tratament}`,
        start: {
          dateTime: startDateTime,
          timeZone: "Europe/Bucharest",
        },
        end: {
          dateTime: endDateTime,
          timeZone: "Europe/Bucharest",
        },
        attendees: [
          {
            email: user.email,
          },
        ],
      },
    });

    res.redirect("/istoric-programari");
  } catch (err) {
    console.error(err);
    res.status(500).send("Programarea nu a putut fi realizată!");
  }
});

app.post("/logout", (req, res) => {
  // eliminați datele de sesiune ale utilizatorului
  req.session.destroy();

  res.sendStatus(200);
});

async function createAdmin() {
  try {
    const existingAdmin = await User.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin account already exists");
      return;
    }

    const hash = await bcrypt.hash("mypassword", saltRounds); // Generăm un hash pentru parolă

    const admin = new User({
      username: "admin",
      email: "admin@example.com",
      password: hash,
      isAdmin: true,
    });
    await admin.save();
    console.log("Admin account created");
  } catch (err) {
    console.error(err);
  }
}

function requireAdmin(req, res, next) {
  // Verificăm dacă utilizatorul este autentificat
  if (req.session && req.session.user) {
    // Verificăm dacă utilizatorul este administrator
    if (req.session.user.isAdmin) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  } else {
    // Redirecționăm utilizatorul către pagina de autentificare
    res.redirect("/login");
  }
}

app.post("/admin/setAdmin", requireAdmin, async (req, res) => {
  const userId = req.body.userId;
  const isAdmin = req.body.isAdmin;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    user.isAdmin = isAdmin;
    await user.save();
    res.send("Success");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Returnează istoricul programărilor utilizatorului curent
app.get("/istoric-programari", requireLogin, async (req, res) => {
  try {
    // Obține utilizatorul curent din sesiune
    const user = req.session.user;
    // Variabilă pentru a stoca programările
    let programari;
    // Verifică dacă utilizatorul este administrator
    if (user.isAdmin) {
      // Obține toate programările și populează relația "user" cu informații despre utilizatori
      programari = await Programare.find().populate("user");
    } else {
      // Obține programările asociate utilizatorului curent și populează relația "user" cu informații despre utilizatori
      programari = await Programare.find({ user: user._id }).populate("user");
    }
    // Obține mesajele utilizatorului
    const mesaje = user.mesaje;
    // Afiseaza șablonul "istoric-programari" și trimite programările, mesajele și informația despre autentificare către acesta
    res.render("istoric-programari", {
      programari,
      mesaje,
      isLoggedIn: true,
      isAdmin: user.isAdmin,
      helperFunctionsEjs: helper,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Adaugă o programare nouă în baza de date și redirecționează utilizatorul înapoi la pagina istoric-programari
app.post("/istoric-programari", requireLogin, async (req, res) => {
  try {
    // Preia datele din formular
    const { prenume, nume, telefon, tratament, data, ora } = req.body;
    // Creează o nouă programare
    const programare = new Programare({
      prenume,
      nume,
      telefon,
      tratament,
      data,
      ora,
      user: req.session.user._id,
    });
    // Salvează programarea în baza de date
    await programare.save();
    // Redirecționează utilizatorul înapoi la pagina istoric-programari
    res.redirect("/istoric-programari");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET /mesaje
// Afișează formularul de căutare a utilizatorului și de trimitere a mesajului
app.get("/mesaje", requireAdmin, async (req, res) => {
  const isLoggedIn = req.session && req.session.user;
  try {
    res.render("mesaje", { isLoggedIn });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST /mesaje
// Căutarea utilizatorului în baza de date după email și adăugarea mesajului în istoricul utilizatorului
app.post("/mesaje", requireAdmin, async (req, res) => {
  try {
    const { email, mesaj } = req.body;
    // Căutăm utilizatorul în baza de date după email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send("Utilizatorul nu a fost găsit");
      return;
    }
    // Adăugăm mesajul în istoricul utilizatorului
    await User.updateOne({ _id: user._id }, { $push: { mesaje: mesaj } });
    res.redirect("/istoric-programari");
  } catch (err) {
    console.error(err);
    res.status(500).send("Eroare server");
  }
});

// Pornim serverul și afișăm un mesaj în consolă pentru a ne anunța că serverul rulează
createAdmin().then(() => {
  app.listen(PORT, () => {
    console.log(`Serverul rulează la adresa http://localhost:${PORT}`);
  });
});
