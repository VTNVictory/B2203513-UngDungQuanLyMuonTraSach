const NhanVien = require("../models/nhanVien.model");
const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const Generate = require("../generate");
const md5 = require("md5");

// [POST] /api/nhanvien/get-user-data
exports.getUserData = async (req, res) => {
  const { token } = req.body; // Lấy token từ body của request

  if (!token) {
    return res.status(400).json({ error: "Cần có token!" });
  }

  try {
    // Tìm người dùng trong cơ sở dữ liệu dựa trên token
    const user = await NhanVien.findOne({ token: token }).select("-PASSWORD");

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ error: "Error!" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

// [GET] /api/nhanvien/
exports.getAllNhanVien = async (req, res, next) => {
  try {
    const { name } = req.query;
    let nhanviens;
    if (name) {
      //findByName
      nhanviens = await NhanVien.find({
        name: { $regex: new RegExp(name), $options: "i" },
      });
    } else {
      //findAll
      nhanviens = await NhanVien.find({});
    }
    res.status(200).json(nhanviens);
  } catch (err) {
    return next(new ApiError(500, `Có lỗi xảy ra khi lấy ra đối tượng`));
  }
};

// [POST] /api/nhanvien/
exports.createNhanVien = async (req, res, next) => {
  req.body.token = Generate.generateRandomString(30);
  req.body.PASSWORD = md5(req.body.PASSWORD);
  req.body.MSNV = `NV${Date.now()}`;
  const nhanvien = new NhanVien(req.body);
  try {
    await nhanvien.save();
    res.status(201).json(nhanvien);
  } catch (err) {
    return next(new ApiError(400, `Có lỗi xảy ra khi tạo một đối tượng mới`));
  }
};
// [POST] /api/nhanvien/login
exports.login = async (req, res, next) => {
  const sdt = req.body.DIENTHOAI;
  const password = req.body.PASSWORD;

  const user = await NhanVien.findOne({
    SODIENTHOAI: sdt,
  });

  if (!user) {
    return next(new ApiError(400, "SDT không tồn tại!"));
  }

  if (md5(password) != user.PASSWORD) {
    return next(new ApiError(400, "Sai mật khẩu!"));
  }

  res.send({ token: user.token, role: "nhanvien" });
};

// [GET] /api/nhanvien/:id
exports.getNhanVienByID = async (req, res, next) => {
  try {
    const nhanvien = await NhanVien.findOne({
      _id: ObjectId.isValid(req.params.id) ? new ObjectId(req.params.id) : null,
    });
    res.status(200).json(nhanvien);
  } catch (err) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi tìm kiếm đối tượng có id=${req.params.id}`
      )
    );
  }
};

// [PUT] /api/nhanvien/:id
exports.updateNhanVien = async (req, res, next) => {
  try {
    const updatedNhanVien = await NhanVien.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedNhanVien) {
      return next(new ApiError(404, "Contact not found"));
    }
    res.status(200).json(updatedNhanVien);
  } catch (err) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi update đối tượng có id=${req.params.id}`
      )
    );
  }
};

// [DELETE] /api/nhanvien/:id
exports.deleteNhanVien = async (req, res, next) => {
  try {
    await NhanVien.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi xóa đối tượng có id=${req.params.id}`
      )
    );
  }
};
