<template>
  <div class="admin-borrow-management">
    <div class="header-actions">
      <h2>Quản lý phiếu mượn</h2>
    </div>

    <div v-if="borrowRecords.length === 0">
      <p>Không có phiếu mượn nào cần xử lý.</p>
    </div>

    <div v-else>
      <div
        v-for="(record, index) in borrowRecords"
        :key="record._id"
        class="borrow-record"
      >
        <div class="record-item">
          <strong>Mã độc giả:</strong> {{ record.MADOCGIA }}
        </div>
        <div class="record-item">
          <strong>Người mượn:</strong> {{ getReaderName(record.MADOCGIA) }}
        </div>
        <div class="record-item">
          <strong>Ngày mượn:</strong> {{ formatDate(record.NGAYMUON) }}
        </div>
        <div class="record-item">
          <strong>Ngày trả:</strong>
          {{ record.NGAYTRA ? formatDate(record.NGAYTRA) : "Chưa trả" }}
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Giá sách</th>
                <th>Số quyển đã mượn</th>
                <th>Năm xuất bản</th>
                <th>Tác giả</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in record.books" :key="book.MASACH">
                <td>{{ getBook(book.MASACH).MASACH || book.MASACH }}</td>
                <td>{{ getBook(book.MASACH).TENSACH }}</td>
                <td>{{ formatCurrency(getBook(book.MASACH).DONGIA) }}</td>
                <td>{{ book.SOQUYEN }}</td>
                <td>{{ getBook(book.MASACH).NAMXUATBAN }}</td>
                <td>{{ getBook(book.MASACH).TACGIA }}</td>
                <td>
                  <select
                    v-model="book.status"
                    @change="updateStatus(record, book)"
                    :class="statusClass(book.status)"
                  >
                    <option value="Chưa lấy sách">Chưa lấy sách</option>
                    <option value="Đã lấy sách">Đã lấy sách</option>
                    <option value="Đã trả">Đã trả</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="index < borrowRecords.length - 1" class="divider"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      borrowRecords: [],
      readers: [],
      books: [],
    };
  },
  created() {
    this.fetchBorrowRecords();
    this.fetchReaders();
    this.fetchBooks();
  },
  methods: {
    async fetchBorrowRecords() {
      try {
        const response = await axios.get("/api/theodoi");
        this.borrowRecords = this.groupBorrowRecords(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phiếu mượn:", error);
      }
    },
    async fetchReaders() {
      const response = await axios.get("/api/docgia");
      this.readers = response.data;
    },
    async fetchBooks() {
      const response = await axios.get("/api/sach");
      this.books = response.data;
    },
    groupBorrowRecords(records) {
      const grouped = {};

      records.forEach((record) => {
        const key = `${record.MADOCGIA}_${new Date(record.NGAYMUON)
          .toISOString()
          .slice(0, 16)}`;

        if (!grouped[key]) {
          grouped[key] = {
            _id: key,
            MADOCGIA: record.MADOCGIA,
            NGAYMUON: record.NGAYMUON,
            NGAYTRA: record.NGAYTRA || null,
            books: {},
          };
        }

        const bookKey = record.MASACH;

        if (!grouped[key].books[bookKey]) {
          grouped[key].books[bookKey] = {
            MASACH: record.MASACH,
            SOQUYEN: 0,
            status: record.status || "Chưa lấy sách",
            _id: record._id,
          };
        }

        grouped[key].books[bookKey].SOQUYEN += record.SOQUYEN || 1;
      });

      return Object.values(grouped).map((group) => ({
        ...group,
        books: Object.values(group.books),
      }));
    },
    getReaderName(madocgia) {
      const reader = this.readers.find((r) => r._id === madocgia);
      return reader ? reader.HOLOT + " " + reader.TEN : "Không rõ";
    },
    getBook(masach) {
      return this.books.find((b) => b._id === masach) || {};
    },
    async updateStatus(record, book) {
      try {
        await axios.put(`/api/theodoi/${book._id}`, {
          status: book.status,
        });
        alert("Cập nhật thành công");
      } catch (err) {
        alert("Cập nhật thất bại");
      }
    },
    formatDate(dateString) {
      if (!dateString) return "Không có dữ liệu";
      const date = new Date(dateString);
      const minutes =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      return `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} ${date.getHours()}:${minutes}`;
    },
    formatCurrency(amount) {
      if (!amount || isNaN(amount)) return "Không xác định";
      return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
    statusClass(status) {
      switch (status) {
        case "Chưa lấy sách":
          return "status-pending";
        case "Đã lấy sách":
          return "status-picked";
        case "Đã trả":
          return "status-returned";
        default:
          return "";
      }
    },
  },
};
</script>

<style scoped>
.admin-borrow-management {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.table-container {
  overflow-x: auto;
}

.borrow-record {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  word-wrap: break-word;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

select {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-weight: bold;
}

.record-item {
  margin-bottom: 8px;
  font-size: 16px;
}

.divider {
  margin-top: 20px;
  border-top: 1px solid #ddd;
}

/* Trạng thái màu */
.status-pending {
  color: #d35400;
}

.status-picked {
  color: #2980b9;
}

.status-returned {
  color: #27ae60;
}
</style>
