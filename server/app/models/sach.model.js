const mongoose = require("mongoose");

const sachSchema = new mongoose.Schema({
  MASACH: {
    type: String,
    require: true,
  },
  TENSACH: String,
  DONGIA: Number,
  SOQUYEN: Number,
  NAMXUATBAN: String,
  MANXB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "nhaxb",
  },
  TACGIA: String,
});

module.exports = mongoose.model("sach", sachSchema, "SACH");
