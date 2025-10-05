const mongoose = require("mongoose");

const VaultItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  username: String,
  password: String,
  url: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VaultItem", VaultItemSchema);
