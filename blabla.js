// const multer = require("multer");
// const upload = multer({ dest: "public/uploads/" });

// const fs = require("fs");
// const path = require("path")

// // Configurare multer pentru încărcarea fișierelor
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads/"); // Folderul în care se vor salva fișierele încărcate
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Numele fișierului se va păstra ca și în original
//   },
// });

// const upload = multer({ storage: storage });

// // GET /utilizatori/adauga-document
// // Afișează formularul de căutare a utilizatorului și încărcarea documentului
// app.get("/utilizatori/adauga-document", requireAdmin, async (req, res) => {
//   try {
//     const mesaj = req.query.mesaj;
//     res.render("adauga-document", { mesaj });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// // POST /utilizatori/adauga-document
// // Căutarea utilizatorului în baza de date după email și încărcarea documentului
// app.post(
//   "/utilizatori/adauga-document",
//   requireAdmin,
//   upload.single("document"),
//   async (req, res) => {
//     try {
//       const email = req.body.email;

//       // Căutăm utilizatorul în baza de date după email
//       const user = await User.findOne({ email });

//       // Verificăm dacă utilizatorul există
//       if (!user) {
//         res.render("adauga-document", {
//           mesaj: "Utilizatorul nu a fost găsit",
//         });
//         return;
//       }

//       // Adăugăm documentul asociat cu email-ul utilizatorului în baza de date
//       user.document = req.file.path; // Calea către fișierul încărcat
//       await user.save();

//       // Afișăm mesajul de succes
//       res.render("adauga-document", {
//         mesaj: "Documentul a fost încărcat cu succes",
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Server error");
//     }
//   }
// );
