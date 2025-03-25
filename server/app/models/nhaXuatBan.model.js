const mongoose = require("mongoose");

const nhaXuatBanSchema = mongoose.Schema({
  MANXB: {
    type: String,
    require: true,
  },
  TENNXB: String,
  DIACHI: String,
});

module.exports = mongoose.model("nhaxb", nhaXuatBanSchema, "NHAXB");
