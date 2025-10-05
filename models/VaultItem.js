const mongoose = require("mongoose");
const fieldEncryption = require("mongoose-field-encryption").fieldEncryption

const VaultItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  username: String,
  password: String,
  url: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

VaultItemSchema.plugin(fieldEncryption, {
  fields: ["password"],
  secret: process.env.PASS_SECRET,
});

module.exports = mongoose.model("VaultItem", VaultItemSchema);
