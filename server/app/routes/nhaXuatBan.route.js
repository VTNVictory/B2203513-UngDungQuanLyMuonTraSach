const express = require("express");
const NXB = require("../controllers/nhaXuatBan.controller");
const router = express.Router();

router.route("/").get(NXB.getAllNXB).post(NXB.createNXB);

router
  .route("/:id")
  .get(NXB.getNXBByID)
  .put(NXB.updateNXB)
  .delete(NXB.deleteNXB);

module.exports = router;
