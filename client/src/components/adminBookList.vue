<template>
  <div class="book-list">
    <div class="header-actions">
      <h2>Quản Lý Sách</h2>
      <button class="btn primary" @click="openAddEditModal()">
        + Thêm sách mới
      </button>
    </div>

    <!-- Thanh tìm kiếm -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm theo tên sách..."
      />
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Đơn giá</th>
            <th>Số quyển</th>
            <th>Năm xuất bản</th>
            <th>Nhà xuất bản</th>
            <th>Tác giả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book._id">
            <td>{{ book.MASACH }}</td>
            <td>{{ book.TENSACH }}</td>
            <td>{{ book.DONGIA.toLocaleString() }} VND</td>
            <td>{{ book.SOQUYEN }}</td>
            <td>{{ book.NAMXUATBAN }}</td>
            <td>{{ book.MANXB ? book.MANXB.TENNXB : "Không có" }}</td>
            <td>{{ book.TACGIA }}</td>
            <td>
              <div class="actions">
                <button class="btn secondary" @click="editBook(book)">
                  Sửa
                </button>
                <button class="btn danger" @click="deleteBook(book._id)">
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Modal thêm/sửa sách -->
    <AddEditBook
      :showModal="showModal"
      :book="selectedBook"
      @closeModal="closeModal"
      @saveBook="getBooks"
    />
  </div>
</template>

<script>
import axios from "axios";
import AddEditBook from "@/components/adminEditBook.vue";

export default {
  name: "BookList",
  components: {
    AddEditBook,
  },
  data() {
    return {
      books: [],
      searchQuery: "", // Thêm state cho ô tìm kiếm
      showModal: false,
      selectedBook: null,
    };
  },
  computed: {
    filteredBooks() {
      if (!this.searchQuery) return this.books;
      return this.books.filter((book) =>
        book.TENSACH.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async getBooks() {
      try {
        const response = await axios.get("/api/sach");
        this.books = response.data;
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    },
    openAddEditModal() {
      this.selectedBook = null;
      this.showModal = true;
    },
    editBook(book) {
      this.selectedBook = book;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedBook = null;
    },
    async deleteBook(bookId) {
      if (confirm("Bạn có chắc chắn muốn xóa sách này không?")) {
        try {
          await axios.delete(`/api/sach/${bookId}`);
          this.getBooks(); // Reload danh sách sách sau khi xóa
        } catch (error) {
          console.error("Lỗi khi xóa sách:", error);
        }
      }
    },
  },
  mounted() {
    this.getBooks();
  },
};
</script>

<style scoped>
.book-list {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
}

.header-actions h2 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.header-actions .btn {
  margin-left: auto;
}

/* Thanh tìm kiếm */
.search-bar {
  margin-bottom: 15px;
  text-align: center;
}

.search-bar input {
  padding: 8px 12px;
  width: 60%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: 0.3s;
}

.search-bar input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

th,
td {
  padding: 12px 16px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn.primary {
  background-color: #28a745;
  color: #fff;
}

.btn.primary:hover {
  background-color: #218838;
}

.btn.secondary {
  background-color: #6c757d;
  color: #fff;
}

.btn.secondary:hover {
  background-color: #5a6268;
}

.btn.danger {
  background-color: #dc3545;
  color: #fff;
}

.btn.danger:hover {
  background-color: #c82333;
}
</style>
