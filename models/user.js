// Importăm modulul Mongoose
const mongoose = require("mongoose");
// Definim schema pentru colecția "users"
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  mesaje: {
    type: [String],
    default: [],
  },
  programari: [{ type: mongoose.Schema.Types.ObjectId, ref: "Programare" }],
});
// Cream modelul "User" pe baza schemei definite
const User = mongoose.model("User", userSchema);
// Exportăm modelul "User" pentru a fi utilizat în alte module
module.exports = User;
