const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  image: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/1911/1911087.png",
    required: false
  },
  id: {
    type: String,
    unique: true,
    required: true,
  },
  adminId: {
    type: String,
    required: true,
  },
  description:{
    type: String,
    default: "No description available",
    required: false
  },
  location: {
    type: String,
    default: "No location available",
    required: false
  },
  time: {
        type: String,
        default: "TBD",
        required: false
    },
});

const Events = mongoose.model("Events",groupSchema);

module.exports = Events



