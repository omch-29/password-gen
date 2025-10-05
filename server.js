const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const engine = require("ejs-mate"); 
const methodOverride = require("method-override");
const path = require("path");

dotenv.config();
const app=express();

mongoose.connect(process.env.ATLASDB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB atlas connected"))
  .catch(err => console.error("mongodb connection error",err));

  app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
// app.use(express.static("public"));
app.use(express.json());

app.use(session({
  secret: "supersecret",
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use(flash());

app.use(methodOverride("_method"));

app.use((req, res, next) => {
  res.locals.user = req.user; 
  res.locals.success = req.flash("success");
  // res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
app.use("/", require("./routes/auth"));
app.use("/vault", require("./routes/vault"));

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));