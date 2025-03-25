const express = require("express");
const docgia = require("../controllers/docGia.controller");

const router = express.Router();

router.route("/").get(docgia.getAllDocGia).post(docgia.createDocGia);

router
  .route("/:id")
  .get(docgia.getDocGiaByID)
  .put(docgia.updateDocGia)
  .delete(docgia.deleteDocGia);
router.route("/login").post(docgia.login);
router.route("/get-user-data").post(docgia.getUserData);

module.exports = router;
