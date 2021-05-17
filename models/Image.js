const mongoose = require("mongoose");


const imageSchema = new mongoose.Schema({
  base64URL: {
    type: String,
    required: [true, "Please upload an image"],
  },  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Image", imageSchema);
