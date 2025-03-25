const express = require("express");
const theodoi = require("../controllers/theoDoiMuonSach.controller");

const router = express.Router();

router
  .route("/")
  .get(theodoi.getAllTheoDoiMuonSach)
  .post(theodoi.createTheoDoiMuonSach);

router
  .route("/:id")
  .get(theodoi.getTheoDoiMuonSachByID)
  .put(theodoi.updateTheoDoiMuonSach)
  .delete(theodoi.deleteTheoDoiMuonSach);

module.exports = router;
