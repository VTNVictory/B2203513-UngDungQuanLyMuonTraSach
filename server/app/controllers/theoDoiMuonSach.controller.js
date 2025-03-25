const TheoDoiMuonSach = require("../models/theoDoiMuonSach.model");
const Sach = require("../models/sach.model");
// const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");

// [GET] /api/theodoi/
exports.getAllTheoDoiMuonSach = async (req, res, next) => {
  try {
    const { name } = req.query;
    let theodois;
    if (name) {
      //findByName
      theodois = await TheoDoiMuonSach.find({
        name: { $regex: new RegExp(name), $options: "i" },
      });
    } else {
      //findAll
      theodois = await TheoDoiMuonSach.find({});
    }
    res.status(200).json(theodois);
  } catch (err) {
    return next(new ApiError(500, `Có lỗi xảy ra khi lấy ra đối tượng`));
  }
};

// [POST] /api/theodoi/
exports.createTheoDoiMuonSach = async (req, res, next) => {
  try {
    const borrowData = req.body;
    // console.log(borrowData);
    for (const borrow of borrowData) {
      const sach = await Sach.findById(borrow.MASACH);
      if (!sach || sach.SOQUYEN <= 0) {
        return res.status(400).json({ message: "Sách không đủ số lượng!" });
      }

      // Tạo thông tin mượn sách
      const newBorrow = new TheoDoiMuonSach({
        MADOCGIA: borrow.MADOCGIA,
        MASACH: borrow.MASACH,
        NGAYTRA: null,
      });
      await newBorrow.save();

      // Giảm số lượng sách
      sach.SOQUYEN -= 1;
      await sach.save();
    }

    res.status(201).json({ message: "Mượn sách thành công!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Lỗi khi mượn sách." });
  }
};

// [GET] /api/theodoi/:id
exports.getTheoDoiMuonSachByID = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Tìm lịch sử mượn sách của người dùng theo MADOCGIA và populate sách
    const theodoi = await TheoDoiMuonSach.find({ MADOCGIA: userId })
      .populate("MASACH", "MASACH TENSACH TACGIA DONGIA NAMXUATBAN") // Chỉ lấy thông tin cần thiết
      .exec();

    // Kiểm tra nếu không có bản ghi
    if (theodoi.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch sử mượn sách" });
    }

    // Xử lý dữ liệu trả về
    const formattedRecords = theodoi.map((item) => ({
      _id: item._id,
      MASACH: item.MASACH.MASACH,
      TENSACH: item.MASACH.TENSACH,
      TACGIA: item.MASACH.TACGIA,
      DONGIA: item.MASACH.DONGIA,
      NAMXUATBAN: item.MASACH.NAMXUATBAN,
      NGAYMUON: item.NGAYMUON,
      NGAYTRA: item.NGAYTRA || null, // Trả về null thay vì "Chưa trả sách"
      status: item.status,
    }));

    res.status(200).json(formattedRecords);
  } catch (err) {
    return next(
      new ApiError(
        500,
        `Lỗi khi lấy lịch sử mượn sách của người dùng ${req.params.id}`
      )
    );
  }
};

// [PUT] /api/theodoi/:id
exports.updateTheoDoiMuonSach = async (req, res, next) => {
  try {
    const { status } = req.body;
    let { NGAYTRA } = req.body;

    // Nếu trạng thái là "Đã trả" nhưng chưa có ngày trả, tự động cập nhật
    if (status === "Đã trả" && !NGAYTRA) {
      NGAYTRA = new Date();
    }

    const record = await TheoDoiMuonSach.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Không tìm thấy phiếu mượn." });
    }

    // Cập nhật thông tin mượn sách
    record.status = status;
    if (NGAYTRA) {
      record.NGAYTRA = NGAYTRA;
    }

    await record.save();

    // Nếu sách được trả, tăng lại số lượng sách
    if (status === "Đã trả") {
      record.NGAYTRA = NGAYTRA || new Date();
    }

    res.json({ message: "Cập nhật thành công", data: record });
  } catch (error) {
    console.error("Lỗi khi cập nhật phiếu mượn:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật phiếu mượn." });
  }
};

// [DELETE] /api/theodoi/:id
exports.deleteTheoDoiMuonSach = async (req, res, next) => {
  try {
    await TheoDoiMuonSach.findByIdAndDelete(req.params.id);
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
