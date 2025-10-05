const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

//login Page
router.get("/login", (req, res) => res.render("login"));

//register Page
router.get("/register", (req, res) => res.render("register"));


router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  let errors = [];

  if (!username || !password) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, username, password });
  } else {
    const user = await User.findOne({ username });
    if (user) {
      errors.push({ msg: "Username already exists" });
      res.render("register", { errors, username, password });
    } else {
      const newUser = new User({ username, password });

      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
              req.flash("success_msg", "You are now registered and can log in");
              res.redirect("/login");
            })
            .catch(err => console.log(err));
        })
      );
    }
  }
});

//login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/vault",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
});

//logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
  });
});

module.exports = router;
