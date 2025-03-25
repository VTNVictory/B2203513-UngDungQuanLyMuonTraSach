const Sach = require("../models/sach.model");
const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");

// [GET] /api/sach/
exports.getAllSach = async (req, res, next) => {
  try {
    const name = req.query.name;
    let sachs;
    if (name) {
      //findByName
      sachs = await Sach.find({
        name: { $regex: new RegExp(name), $options: "i" },
      })
        .populate("MANXB")
        .sort({ MASACH: 1 });
    } else {
      //findAll
      sachs = await Sach.find().populate("MANXB").sort({ MASACH: 1 });
    }
    res.status(200).json(sachs);
  } catch (err) {
    return next(
      new ApiError(500, `Có lỗi xảy ra khi lấy ra đối tượng: ${err.message}`)
    );
  }
};

// [POST] /api/sach/
exports.createSach = async (req, res, next) => {
  const sach = new Sach(req.body);
  try {
    await sach.save();
    res.status(201).json(sach);
  } catch (err) {
    return next(new ApiError(400, `Có lỗi xảy ra khi tạo một đối tượng mới`));
  }
};

// [GET] /api/sach/:id
exports.getSachByID = async (req, res, next) => {
  try {
    const sach = await Sach.findOne({
      _id: ObjectId.isValid(req.params.id) ? new ObjectId(req.params.id) : null,
    });
    res.status(200).json(sach);
  } catch (err) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi tìm kiếm đối tượng có id=${req.params.id}`
      )
    );
  }
};

// [PUT] /api/sach/:id
exports.updateSach = async (req, res, next) => {
  try {
    const updatedSach = await Sach.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedSach) {
      return next(new ApiError(404, "Contact not found"));
    }
    res.status(200).json(updatedSach);
  } catch (err) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi update đối tượng có id=${req.params.id}`
      )
    );
  }
};

// [DELETE] /api/sach/:id
exports.deleteSach = async (req, res, next) => {
  try {
    await Sach.findByIdAndDelete(req.params.id);
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
