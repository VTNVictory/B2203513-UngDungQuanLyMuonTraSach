<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h3>{{ localBook._id ? "Cập nhật sách" : "Thêm sách mới" }}</h3>
      <form @submit.prevent="saveBook">
        <label>Mã sách:</label>
        <input v-model="localBook.MASACH" type="text" required />

        <label>Tên sách:</label>
        <input v-model="localBook.TENSACH" type="text" />

        <label>Đơn giá:</label>
        <input v-model="localBook.DONGIA" type="number" />

        <label>Số quyển:</label>
        <input v-model="localBook.SOQUYEN" type="number" />

        <label>Năm xuất bản:</label>
        <input v-model="localBook.NAMXUATBAN" type="text" />

        <label>Nhà xuất bản:</label>
        <select v-model="localBook.MANXB" required>
          <option value="" disabled selected>Chọn nhà xuất bản</option>
          <option
            v-for="publisher in publishers"
            :key="publisher._id"
            :value="publisher._id"
          >
            {{ publisher.TENNXB }}
          </option>
        </select>

        <label>Tác giả:</label>
        <input v-model="localBook.TACGIA" type="text" />

        <div class="modal-actions">
          <button type="submit">
            {{ localBook._id ? "Lưu thay đổi" : "Thêm" }}
          </button>
          <button type="button" @click="closeModal">Hủy</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AddEditBook",
  props: {
    showModal: Boolean,
    book: Object,
  },
  data() {
    return {
      localBook: {
        MASACH: "",
        TENSACH: "",
        DONGIA: null,
        SOQUYEN: null,
        NAMXUATBAN: "",
        MANXB: "", // Mã nhà xuất bản
        TACGIA: "",
      },
      publishers: [], // Danh sách nhà xuất bản
    };
  },
  watch: {
    book: {
      handler(newBook) {
        if (newBook) {
          // Gán giá trị sách vào localBook, bao gồm MANXB (mã nhà xuất bản)
          this.localBook = { ...newBook };
        } else {
          // Reset khi không có sách nào được chọn
          this.localBook = {
            MASACH: "",
            TENSACH: "",
            DONGIA: null,
            SOQUYEN: null,
            NAMXUATBAN: "",
            MANXB: "", // Mặc định không có nhà xuất bản
            TACGIA: "",
          };
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async fetchPublishers() {
      try {
        const response = await axios.get("http://localhost:3000/api/nxb");
        this.publishers = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
      }
    },
    async saveBook() {
      try {
        console.log("Dữ liệu gửi đi:", this.localBook);
        if (this.localBook._id) {
          // Cập nhật sách
          await axios.put(
            `http://localhost:3000/api/sach/${this.localBook._id}`,
            this.localBook
          );
        } else {
          // Thêm sách mới
          await axios.post("http://localhost:3000/api/sach", this.localBook);
        }
        this.$emit("saveBook");
        this.closeModal();
      } catch (error) {
        console.error("Lỗi khi lưu sách:", error);
      }
    },
    closeModal() {
      this.$emit("closeModal");
    },
  },
  mounted() {
    this.fetchPublishers();
  },
};
</script>

<style scoped>
/* Your styles here */
</style>

<style scoped>
.modal {
  position: fixed;
  margin: auto;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  cursor: pointer;
}

h3 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 10px;
}

label {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0px;
}

input[type="text"],
input[type="email"],
input[type="date"],
input[type="number"] {
  width: 100%;
  padding: 5px;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 6px;
  margin-top: 5px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="date"]:focus {
  border-color: #007bff;
  outline: none;
}

input[disabled] {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.modal-actions button {
  padding: 12px 20px;
  margin-top: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-actions button[type="submit"] {
  background-color: #28a745;
  color: white;
}

.modal-actions button[type="button"] {
  background-color: #dc3545;
  color: white;
}

.modal-actions button:hover {
  opacity: 0.9;
}

select {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 5px;
  font-size: 1rem;
}

/* 
select {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    border: 2px solid #ccc;
    border-radius: 6px;
    margin-top: 5px;
    transition: border-color 0.3s;
}

select:focus {
    border-color: #007bff;
    outline: none;
} */
</style>
