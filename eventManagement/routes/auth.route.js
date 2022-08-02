const router = require("express").Router();
const User = require("../models/user.model");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const { ensureLoggedOut, ensureLoggedIn } = require("connect-ensure-login");
const { registerValidator } = require("../utils/validators");

router.get(
  "/login",
  ensureLoggedOut({ redirectTo: "/" }),
  async (req, res, next) => {
    try{
        res.render("login");
    }catch(err){
        next(err);
    }
  }
);

router.post(
  "/login",
  ensureLoggedOut({ redirectTo: "/" }),
  passport.authenticate("local", {
    successReturnToOrRedirect: "/user/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get(
  "/logout",
  ensureLoggedIn({ redirectTo: "/user/dashboard" }),
  async (req, res, next) => {
    req.logout((error)=>{
      console.log(error)
    });
    res.redirect("/");
  }
);
router.get(
  '/studentcalender', async (req, res, next) => {
    try{
        res.render("studentcalender");
    }catch(err){
        next(err);
    }
  }
);

module.exports = router;