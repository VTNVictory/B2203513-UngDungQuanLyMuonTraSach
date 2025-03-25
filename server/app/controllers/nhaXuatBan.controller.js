const NXB = require("../models/nhaXuatBan.model");
const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");

// [GET] /api/nxb/
exports.getAllNXB = async (req, res, next) => {
  try {
    const { name } = req.query;
    let nxbs;
    if (name) {
      //findByName
      nxbs = await NXB.find({
        name: { $regex: new RegExp(name), $options: "i" },
      });
    } else {
      //findAll
      nxbs = await NXB.find({});
    }
    res.status(200).json(nxbs);
  } catch (err) {
    return next(new ApiError(500, `Có lỗi xảy ra khi lấy ra đối tượng`));
  }
};

// [POST] /api/nxb/
exports.createNXB = async (req, res, next) => {
  const nxb = new NXB(req.body);
  try {
    await nxb.save();
    res.status(201).json(nxb);
  } catch (err) {
    return next(new ApiError(400, `Có lỗi xảy ra khi tạo một đối tượng mới`));
  }
};

// [GET] /api/nxb/:id
exports.getNXBByID = async (req, res, next) => {
  try {
    const nxb = await NXB.findOne({
      _id: ObjectId.isValid(req.params.id) ? new ObjectId(req.params.id) : null,
    });
    res.status(200).json(nxb);
  } catch (err) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi tìm kiếm đối tượng có id=${req.params.id}`
      )
    );
  }
};

// [PUT] /api/nxb/:id
exports.updateNXB = async (req, res, next) => {
  try {
    const updatedNXB = await NXB.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedNXB) {
      return next(new ApiError(404, "Contact not found"));
    }
    res.status(200).json("update thành công");
  } catch (err) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi update đối tượng có id=${req.params.id}`
      )
    );
  }
};

// [DELETE] /api/nxb/:id
exports.deleteNXB = async (req, res, next) => {
  try {
    await NXB.findByIdAndDelete(req.params.id);
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
