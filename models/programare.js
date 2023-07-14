const mongoose = require("mongoose");

const programareSchema = new mongoose.Schema(
  {
    prenume: {
      type: String,
      required: true,
    },
    nume: {
      type: String,
      required: true,
    },
    telefon: {
      type: String,
      required: true,
    },
    tratament: {
      type: String,
      required: true,
    },
    data: {
      type: Date,
      required: true,
    },
    ora: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { collection: "programari" }
);

const Programare = mongoose.model("Programare", programareSchema);

module.exports = Programare;
