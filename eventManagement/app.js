const express = require("express");
const createHttpError = require("http-errors");
const morgan = require("morgan");
const mongoose = require("./db/mongoose");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const connectMongo = require("connect-mongo");
const { ensureLoggedIn } = require("connect-ensure-login");
const { roles } = require("./utils/roles");
const { User, registerAdmin } = require("./models/user.model");
const fileUpload = require("express-fileupload");
const connectFlash = require("connect-flash");
const path = require("path");

// Initialization step
const app = express();
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MongoStore = connectMongo(session);

// Init Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// For Passport JS Authentication
app.use(passport.initialize());
app.use(passport.session());
require("./utils/passport.auth");

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Connect Flash
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});


//using express-fileUpload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
  })
);

// Routes
app.use("/", require("./routes/index.route.js"));
app.use("/auth", require("./routes/auth.route"));
app.use(
  "/user",
  ensureLoggedIn({ redirectTo: "/auth/login" }),
  require("./routes/user.route")
);
app.use(
  "/admin",
  ensureLoggedIn({ redirectTo: "/auth/login" }),
  ensureAdmin,
  require("./routes/admin.route")
);

// 404 Handler
app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

// Error Handler
app.use((error, req, res, next) => {
  console.log(req);
  error.status = error.status || 500;
  res.status(error.status);
  res.render("error", { error });
});

// Setting the PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server Running 🚩🚩🚩 @ http://localhost:${PORT}`)
);

function ensureAdmin(req, res, next) {
  if (req.user.roleName === roles.admin) {
    next();
  } else {
    // req.flash("warning", "you are not Authorized to see this route");
    console.log("warning", "you are not Authorized to see this route");
    res.redirect("/");
  }
}
