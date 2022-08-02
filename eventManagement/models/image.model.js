const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  imagePath : {
    type: String,
    required: true,
    lowercase: true,
  }
});

const Image = mongoose.model("image", ImageSchema);
module.exports = Image;
