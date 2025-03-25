const express = require("express");
const nhanvien = require("../controllers/nhanVien.controller");

const router = express.Router();

router.route("/").get(nhanvien.getAllNhanVien).post(nhanvien.createNhanVien);

router
  .route("/:id")
  .get(nhanvien.getNhanVienByID)
  .put(nhanvien.updateNhanVien)
  .delete(nhanvien.deleteNhanVien);

router.route("/login").post(nhanvien.login);
router.route("/get-user-data").post(nhanvien.getUserData);

module.exports = router;
