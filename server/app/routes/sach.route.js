const express = require("express");
const Sach = require("../controllers/sach.controller");
const router = express.Router();

router.route("/").get(Sach.getAllSach).post(Sach.createSach);

router
  .route("/:id")
  .get(Sach.getSachByID)
  .put(Sach.updateSach)
  .delete(Sach.deleteSach);

module.exports = router;
