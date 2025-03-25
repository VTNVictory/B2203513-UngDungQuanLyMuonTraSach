<template>
  <div class="book-list-container">
    <h2>Danh sách sách</h2>

    <!-- Thanh tìm kiếm -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm theo tên sách..."
      />
    </div>

    <div class="book-grid">
      <div
        class="book-card"
        :class="{ 'out-of-stock': book.SOQUYEN === 0 }"
        v-for="book in filteredBooks"
        :key="book.MASACH"
      >
        <div class="book-info">
          <h3>{{ book.TENSACH }}</h3>
          <p><strong>Giá:</strong> {{ book.DONGIA.toLocaleString() }} VND</p>
          <p><strong>Số quyển:</strong> {{ book.SOQUYEN }}</p>
          <p><strong>Năm xuất bản:</strong> {{ book.NAMXUATBAN }}</p>
          <p>
            <strong>Nhà xuất bản:</strong>
            {{ book.MANXB ? book.MANXB.TENNXB : "Không có" }}
          </p>
          <p><strong>Tác giả:</strong> {{ book.TACGIA }}</p>
        </div>

        <button
          :disabled="book.SOQUYEN <= 0"
          @click="handleSelect(book)"
          :class="{
            disabled: book.SOQUYEN <= 0,
            selected: isBookSelected(book),
          }"
        >
          {{
            isBookSelected(book)
              ? "Đã chọn"
              : book.SOQUYEN > 0
              ? "Chọn sách"
              : "Hết sách"
          }}
        </button>
      </div>
    </div>

    <!-- SLOT cho nút mượn sách -->
    <div class="footer-slot">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    selectedBooks: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      books: [],
      searchQuery: "", // Thêm state cho ô tìm kiếm
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
  mounted() {
    this.getBooks();
  },
  methods: {
    async getBooks() {
      try {
        const response = await axios.get("http://localhost:3000/api/sach");
        this.books = response.data;
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    },
    handleSelect(book) {
      if (this.isBookSelected(book)) {
        this.$emit("deselect-book", book);
      } else {
        this.$emit("select-book", book);
      }
    },
    isBookSelected(book) {
      return this.selectedBooks.some((b) => b.MASACH === book.MASACH);
    },
  },
};
</script>

<style scoped>
.book-list-container {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  font-size: 2rem;
  text-align: center;
}

/* Thanh tìm kiếm */
.search-bar {
  margin-bottom: 20px;
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

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.book-card {
  background: #ffffff;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 300px;
  transition: 0.3s;
  text-align: center;
}

.book-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.book-card h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #2c3e50;
  text-align: center;
  min-height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1.2;
  font-weight: 700;
  transition: color 0.3s, transform 0.3s;
}

.book-card h3:hover {
  color: #3498db;
  transform: scale(1.05);
}

.book-card .book-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.book-card p {
  margin: 4px 0;
  font-size: 14px;
  text-align: center;
}

button {
  margin-top: 10px;
  width: 100%;
  padding: 8px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2980b9;
}

button.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button.selected {
  background-color: #2ecc71;
}

button.selected:hover {
  background-color: #27ae60;
}

.book-card.out-of-stock {
  background-color: #ffebee;
  border: 1px solid #e57373;
}

.book-card.out-of-stock h3,
.book-card.out-of-stock p {
  color: #d32f2f;
}

.footer-slot {
  margin-top: 30px;
  text-align: center;
}
</style>
