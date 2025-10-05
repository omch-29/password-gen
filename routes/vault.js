const express = require("express");
const router = express.Router();
const VaultItem = require("../models/VaultItem");


function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error_msg", "Please log in first");
  res.redirect("/login");
}

// Dashboard
router.get("/", ensureAuth, async (req, res) => {
  const items = await VaultItem.find({ user: req.user.id });
  res.render("dashboard", { user: req.user, items });
});

// Add new password through form
// router.get("/add", ensureAuth, (req, res) => {
//   res.render("vault", { item: {} });
// });
router.get("/add", ensureAuth, async (req, res) => {
  const vaults = await VaultItem.find({ user: req.user.id }); // fetch existing items
  res.render("vault", { item: {}, vaults }); // pass vaults to EJS
});
// Save password
router.post("/", ensureAuth, async (req, res) => {
  const { title, username, password, url, notes } = req.body;
  await VaultItem.create({ user: req.user.id, title, username, password, url, notes });
  req.flash("success", "Entry added!");
  console.log("New vault item added!");
  res.redirect("/vault");
});

// Edit item
// router.get("/edit/:id", ensureAuth, async (req, res) => {
//   const item = await VaultItem.findById(req.params.id);
//   res.render("vault", { item });
// });
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const item = await VaultItem.findById(req.params.id);
  const vaults = await VaultItem.find({ user: req.user.id }); // also load others
  res.render("vault", { item, vaults }); // pass both
});

router.put("/:id", ensureAuth, async (req, res) => {
  const { title, username, password, url, notes } = req.body;
  await VaultItem.findByIdAndUpdate(req.params.id, { title, username, password, url, notes });
  req.flash("success_msg", "Entry updated!");
  res.redirect("/vault");
});

//delete item
router.delete("/:id", ensureAuth, async (req, res) => {
  await VaultItem.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Entry deleted!");
  res.redirect("/vault");
});

module.exports = router;
