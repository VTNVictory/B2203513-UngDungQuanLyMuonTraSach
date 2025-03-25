const mongoose = require("mongoose");

const docGiaSchema = new mongoose.Schema({
  MADOCGIA: {
    type: String,
    require: true,
  },
  HOLOT: String,
  TEN: String,
  NGAYSINH: Date,
  PHAI: String,
  DIACHI: String,
  DIENTHOAI: String,
  PASSWORD: String,
  token: String,
});

module.exports = mongoose.model("docgia", docGiaSchema, "DOCGIA");
