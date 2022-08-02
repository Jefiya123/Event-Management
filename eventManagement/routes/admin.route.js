const router = require("express").Router();
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const path = require("path");

router.get("/register-users", async (req, res, next) => {
  try {
    res.render("register-users");
  } catch (error) {
    next(error);
  }
});

router.post("/register-users", async (req, res, next) => {
  try {
    const file = req.files.pFile;
    const fileName = new Date().getTime().toString() + path.extname(file.name);
    const savePath = path.join(
      __dirname,
      "../public",
      "user-uploads",
      fileName
    );
    if (file.truncated) {
      throw new Error("File size is too big");
    }
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      await file.mv(savePath);
      let wb = xlsx.readFile(savePath, { sheetRows: 1 });

      for (let i = 0; i < 4; i++) {
        const sheetName = wb.SheetNames[i];
        let sheetValue = wb.Sheets[sheetName];

        //reading the headers of excel sheet and storing in columnsArray
        const columnsArray = xlsx.utils.sheet_to_json(sheetValue, {
          header: 1,
        })[0];
        console.log(columnsArray);

        //reading the excel body and we get an array of objects
        wb = xlsx.readFile(savePath);
        sheetValue = wb.Sheets[sheetName];
        let excelData = xlsx.utils.sheet_to_json(sheetValue);

        excelData.forEach(async (obj) => {
          delete obj[`${columnsArray[0]}`];
          obj["username"] = obj[`${columnsArray[1]}`].toLowerCase();
          delete obj[`${columnsArray[1]}`];
          obj["email"] = obj[`${columnsArray[2]}`];
          // delete obj[`${columnsArray[2]}`];
          obj["password"] = obj[`${columnsArray[3]}`];
          // delete obj[`${columnsArray[3]}`];

          console.log(obj);
          obj.username = ("" + obj.username + "").trim();
          obj.email = ("" + obj.email + "").trim();
          obj.password = ("" + obj.password + "").trim();

          const doesExist = await User.findOne({ email: obj.email });
          if (!doesExist) {
            const user = new User(obj);
            await user.save();
          }
        });
      }
      //req.flash("success", "Your file is uploaded successfully and users are registered successfully");
      console.log(
        "Your file is uploaded successfully and users are registered successfully"
      );
    } else {
      throw new Error("Only excel sheet(.xlsx) is allowed");
    }
    res.redirect("/")
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

module.exports = router;
