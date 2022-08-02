const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/user.model");
const { roles } = require("./../utils/roles");



// function for registering the admin
async function registerAdmin() {
    try {
      const doesExist = await User.findOne({ email : process.env.ADMIN_EMAIL });
      obj = {};
      obj["username"] = process.env.ADMIN_USERNAME;
      obj["email"] = process.env.ADMIN_EMAIL;
      obj["password"] = process.env.ADMIN_PASSWORD;
      obj["roleName"] = roles.admin;
  
      if (!doesExist) {
        const user = new User(obj);
        await user.save();
      }
    } catch (err) {
      console.log(err);
    }
  }

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Mongodb💾 connected...");
    registerAdmin();
  })
  .catch((err) => console.log(err.message));

  module.exports=mongoose