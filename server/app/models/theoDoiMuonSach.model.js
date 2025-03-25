const mongoose = require("mongoose");

const theoDoiMuonSachSchema = mongoose.Schema({
  MADOCGIA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "docgia",
    required: true,
  },
  MASACH: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sach",
    required: true,
  },
  NGAYMUON: {
    type: Date,
    required: true,
    default: Date.now,
  },
  NGAYTRA: Date,
  status: {
    type: String,
    enum: ["Chưa lấy sách", "Đã lấy sách", "Đã trả"], // Thêm enum để chỉ định các giá trị hợp lệ
    default: "Chưa lấy sách", // Cung cấp giá trị mặc định nếu cần
  },
});

module.exports = mongoose.model(
  "theodoimuonsach",
  theoDoiMuonSachSchema,
  "THEODOIMUONSACH"
);
