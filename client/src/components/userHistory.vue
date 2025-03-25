<template>
  <div class="user-borrow-history">
    <div class="header-actions">
      <h2>Lịch sử mượn sách</h2>
    </div>

    <!-- Nếu không có lịch sử mượn -->
    <div v-if="borrowRecords.length === 0" class="no-record">
      <p>Hiện tại bạn chưa mượn sách nào.</p>
    </div>

    <!-- Danh sách lịch sử mượn sách -->
    <div v-else>
      <div
        v-for="(record, index) in borrowRecords"
        :key="record._id || index"
        class="borrow-record"
      >
        <!-- Thêm tiêu đề Phiếu mượn # -->
        <h3 class="borrow-title">Phiếu mượn #{{ index + 1 }}</h3>

        <div class="record-item">
          <strong>Ngày mượn:</strong> {{ formatDate(record.NGAYMUON) }}
        </div>
        <div class="record-item">
          <strong>Ngày trả:</strong>
          {{ record.NGAYTRA ? formatDate(record.NGAYTRA) : "Chưa trả" }}
        </div>

        <!-- Bảng thông tin sách -->
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
                <td>{{ book.MASACH }}</td>
                <td>{{ book.TENSACH }}</td>
                <td>{{ formatCurrency(book.DONGIA) }}</td>
                <td>{{ book.SOQUYEN }}</td>
                <td>{{ book.NAMXUATBAN }}</td>
                <td>{{ book.TACGIA }}</td>
                <td :class="statusClass(book.status)">
                  {{ book.status }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Divider -->
        <div v-if="index < borrowRecords.length - 1" class="divider"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getUserDataFromToken } from "@/services/getUserData.service";

export default {
  data() {
    return {
      borrowRecords: [],
    };
  },
  created() {
    this.fetchBorrowRecords();
  },
  methods: {
    async fetchBorrowRecords() {
      const user = await getUserDataFromToken();
      if (!user || !user._id) {
        console.error("Không tìm thấy thông tin người dùng");
        return;
      }
      try {
        const response = await axios.get(`/api/theodoi/${user._id}`);
        this.borrowRecords = this.groupBooksByBorrow(response.data) || [];
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lịch sử mượn sách:", error);
      }
    },
    groupBooksByBorrow(records) {
      const groupedRecords = {};

      records.forEach((record) => {
        const borrowDateStr = new Date(record.NGAYMUON)
          .toISOString()
          .slice(0, 16);

        if (!groupedRecords[borrowDateStr]) {
          groupedRecords[borrowDateStr] = {
            NGAYMUON: record.NGAYMUON,
            NGAYTRA: record.NGAYTRA || null,
            books: {},
          };
        }

        const bookKey = record.MASACH;

        if (!groupedRecords[borrowDateStr].books[bookKey]) {
          groupedRecords[borrowDateStr].books[bookKey] = {
            MASACH: record.MASACH,
            TENSACH: record.TENSACH,
            DONGIA: record.DONGIA,
            NAMXUATBAN: record.NAMXUATBAN,
            TACGIA: record.TACGIA,
            SOQUYEN: 0,
            status: record.status || "Chưa lấy sách",
          };
        }

        groupedRecords[borrowDateStr].books[bookKey].SOQUYEN +=
          record.SOQUYEN || 1;
      });

      return Object.values(groupedRecords).map((group) => ({
        ...group,
        books: Object.values(group.books),
      }));
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const minutes =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      return `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} ${date.getHours()}:${minutes}`;
    },
    formatCurrency(amount) {
      return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
    statusClass(status) {
      switch (status) {
        case "Chưa lấy sách":
          return "status-pending";
        case "Đã lấy":
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
.user-borrow-history {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

h2 {
  font-size: 2rem;
  color: #333;
}

.no-record p {
  text-align: center;
  color: #6c757d;
}

.borrow-record {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.borrow-title {
  font-size: 1.3rem;
  color: #2e7d32; /* chỉ tiêu đề màu xanh lá đậm */
  margin-bottom: 10px;
  font-weight: 600;
}

.record-item {
  margin-bottom: 8px;
  font-size: 16px;
}

.table-container {
  overflow-x: auto;
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

.divider {
  margin-top: 20px;
  border-top: 1px solid #ddd;
}

/* Trạng thái màu sắc */
/* Trạng thái màu sắc */
.status-pending {
  color: #e67e22; /* cam nổi hơn */
  font-weight: bold;
}

.status-picked {
  color: #0d47a1; /* xanh dương đậm */
  font-weight: bold;
}

.status-returned {
  color: #27ae60; /* xanh lá */
  font-weight: bold;
}

tbody tr:hover {
  background-color: #e3f2fd; /* xanh nhạt khi hover */
}

@media (max-width: 768px) {
  th,
  td {
    padding: 10px;
    font-size: 14px;
  }
}
</style>
