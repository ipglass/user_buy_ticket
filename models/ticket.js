const mongoose = require("mongoose");

const summarySchema = mongoose.Schema({
  id: { type: String, required: true, min: 3 },
  title: { type: String, required: true, min: 5 },
  price: { type: Number, required: true, min: 1 },
  from_location: { type: String, required: true, min: 3 },
  to_location: { type: String, required: true, min: 3 },
  to_location_photo_url: {type: String, required: true, min: 6 }  
  });

module.exports = mongoose.model("Ticket", summarySchema );
