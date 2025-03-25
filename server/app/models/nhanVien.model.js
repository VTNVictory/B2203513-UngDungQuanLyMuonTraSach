const mongoose = require("mongoose");

const nhanVienSchema = mongoose.Schema({
  MSNV: {
    type: String,
    require: true,
  },
  HOTENNV: String,
  PASSWORD: String,
  CHUCVU: String,
  DIACHI: String,
  SODIENTHOAI: String,
  token: String,
});

module.exports = mongoose.model("nhanvien", nhanVienSchema, "NHANVIEN");
