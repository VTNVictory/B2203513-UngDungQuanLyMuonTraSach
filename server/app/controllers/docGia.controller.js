const DocGia = require("../models/docGia.model");
const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const Generate = require("../generate");
const md5 = require("md5");

// [POST] /api/docgia/get-user-data
exports.getUserData = async (req, res) => {
  const { token } = req.body; // Lấy token từ body của request

  if (!token) {
    return res.status(400).json({ error: "Cần có token!" });
  }

  try {
    // Tìm người dùng trong cơ sở dữ liệu dựa trên token
    const user = await DocGia.findOne({ token: token }).select("-PASSWORD");

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

// [GET] /api/docgia/
exports.getAllDocGia = async (req, res, next) => {
  try {
    const { name } = req.query;
    let docgias;
    if (name) {
      //findByName
      docgias = await DocGia.find({
        name: { $regex: new RegExp(new RegExp(name)), $options: "i" },
      });
    } else {
      //findAll
      docgias = await DocGia.find({});
    }
    res.status(200).json(docgias);
  } catch (err) {
    return next(new ApiError(500, `Có lỗi xảy ra khi lấy ra đối tượng`));
  }
};

// [POST] /api/docgia/
exports.createDocGia = async (req, res, next) => {
  req.body.token = Generate.generateRandomString(30);
  req.body.PASSWORD = md5(req.body.PASSWORD);

  const docgia = new DocGia(req.body);
  try {
    await docgia.save();
    res.status(200).json(docgia);
  } catch (err) {
    return next(new ApiError(400, `Có lỗi xảy ra khi tạo một đối tượng mới`));
  }
};

// [POST] /api/docgia/login
exports.login = async (req, res, next) => {
  const sdt = req.body.DIENTHOAI;
  const password = req.body.PASSWORD;

  const user = await DocGia.findOne({
    DIENTHOAI: sdt,
  });

  if (!user) {
    return next(new ApiError(400, "SĐT không tồn tại!"));
  }

  if (md5(password) != user.PASSWORD) {
    return next(new ApiError(400, "Sai mật khẩu!"));
  }

  res.send({ token: user.token, role: "docgia" });
};

// [GET] /api/docgia/:id
exports.getDocGiaByID = async (req, res, next) => {
  try {
    const docgia = await DocGia.findOne({
      _id: ObjectId.isValid(req.params.id) ? new ObjectId(req.params.id) : null,
    });
    res.status(200).json(docgia);
  } catch (err) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi tìm kiếm đối tượng có id=${req.params.id}`
      )
    );
  }
};

// [PUT] /api/docgia/:id
exports.updateDocGia = async (req, res, next) => {
  try {
    const updatedDocGia = await DocGia.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedDocGia) {
      return next(new ApiError(404, "Không thể update!"));
    }
    res.status(200).json(updatedDocGia);
  } catch (err) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi update đối tượng có id=${req.params.id}`
      )
    );
  }
};

// [DELETE] /api/docgia/:id
exports.deleteDocGia = async (req, res, next) => {
  try {
    await DocGia.findByIdAndDelete(req.params.id);
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
