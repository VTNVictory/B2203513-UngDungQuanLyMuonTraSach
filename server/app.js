const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const sachRouter = require("./app/routes/sach.route");
const docgiaRouter = require("./app/routes/docGia.route");
const nhanvienRouter = require("./app/routes/nhanVien.route");
const nxbRouter = require("./app/routes/nhaXuatBan.route");
const theodoimuonsachRouter = require("./app/routes/theoDoiMuonSach.route");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the website." });
});

app.use("/api/sach", sachRouter);
app.use("/api/docgia", docgiaRouter);
app.use("/api/nhanvien", nhanvienRouter);
app.use("/api/nxb", nxbRouter);
app.use("/api/theodoi", theodoimuonsachRouter);

//handle 404 response
app.use((req, res, next) => {
  //code o day se chay khi khong co route duoc dinh nghia nao
  //khop voi yeu cau. Goi next() de chuyen sang middleware su ly loi
  return next(new ApiError(404, "Resource not found"));
});

//define error-handling middleware last, after other app.use() and routes calls
app.use((error, req, res, next) => {
  //middleware xu ly loi tap trung.
  //trong cac giai doan code xu ly o cac route, goi next(error) se chuyen ve middleware xu ly loi nay
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
