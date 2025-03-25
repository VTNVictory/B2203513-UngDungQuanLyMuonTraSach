<template>
  <div class="user-profile" v-if="user">
    <div class="profile-card">
      <h2>Thông tin tài khoản</h2>
      <div v-if="loading" class="loading">Đang tải...</div>
      <div v-else>
        <template v-if="role === 'nhanvien'">
          <p><strong>MSNV:</strong> {{ user.MSNV }}</p>
          <p><strong>Họ và tên:</strong> {{ user.HOTENNV }}</p>
          <p><strong>Chức vụ:</strong> {{ user.CHUCVU }}</p>
          <p><strong>Địa chỉ:</strong> {{ user.DIACHI }}</p>
          <p><strong>Số điện thoại:</strong> {{ user.SODIENTHOAI }}</p>
        </template>
        <template v-else>
          <p><strong>Mã độc giả:</strong> {{ user.MADOCGIA }}</p>
          <p><strong>Họ và tên:</strong> {{ user.fullname }}</p>
          <p><strong>Ngày sinh:</strong> {{ formattedDate }}</p>
          <p><strong>Giới tính:</strong> {{ user.PHAI }}</p>
          <p><strong>Địa chỉ:</strong> {{ user.DIACHI }}</p>
          <p><strong>Số điện thoại:</strong> {{ user.DIENTHOAI }}</p>
        </template>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button @click="editAccount" class="edit-btn">Chỉnh sửa tài khoản</button>
    </div>

    <!-- Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h3>Chỉnh sửa thông tin</h3>
        <form @submit.prevent="saveChanges">
          <!-- Họ tên -->
          <div class="form-group">
            <label>Họ và tên</label>
            <input type="text" v-model="user.fullname" required />
          </div>
          <!-- Ngày sinh -->
          <div v-if="role === 'docgia'" class="form-group">
            <label>Ngày sinh</label>
            <input type="date" v-model="user.NGAYSINH" required />
          </div>
          <!-- Giới tính -->
          <div v-if="role === 'docgia'" class="form-group">
            <label>Giới tính</label>
            <select v-model="user.PHAI">
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <!-- Địa chỉ -->
          <div class="form-group">
            <label>Địa chỉ</label>
            <input type="text" v-model="user.DIACHI" required />
          </div>
          <!-- Action -->
          <div class="modal-actions">
            <button type="submit" class="btn save">Lưu</button>
            <button type="button" @click="closeEditModal" class="btn cancel">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const user = ref(null);
const loading = ref(true);
const error = ref(null);
const showEditModal = ref(false);

const role = computed(() => JSON.parse(localStorage.getItem("role")));
const userId = computed(() => route.params.id);

const formattedDate = computed(() => {
  if (user.value && user.value.NGAYSINH) {
    return new Date(user.value.NGAYSINH).toLocaleDateString("vi-VN");
  }
  return "";
});

watch(userId, () => {
  fetchUserData(userId.value);
});

onMounted(() => {
  fetchUserData(userId.value);
});

async function fetchUserData(id) {
  loading.value = true;
  error.value = null;
  try {
    const res = await axios.get(`/api/${role.value}/${id}`);
    user.value = res.data;
    if (role.value === "nhanvien") {
      user.value.fullname = user.value.HOTENNV;
    } else {
      user.value.fullname = `${user.value.HOLOT} ${user.value.TEN}`;
    }
  } catch (err) {
    error.value = "Không thể lấy thông tin người dùng.";
  } finally {
    loading.value = false;
  }
}

function editAccount() {
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
}

async function saveChanges() {
  try {
    // Xử lý fullname
    if (role.value !== "nhanvien") {
      const parts = user.value.fullname.trim().split(" ");
      user.value.HOLOT = parts.slice(0, -1).join(" ");
      user.value.TEN = parts.slice(-1).join("");
    } else {
      user.value.HOTENNV = user.value.fullname;
    }
    const updated = { ...user.value, fullname: undefined };
    await axios.put(`/api/${role.value}/${user.value._id}`, updated);
    alert("Cập nhật thành công!");
    closeEditModal();
  } catch (err) {
    alert("Cập nhật thất bại.");
  }
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.profile-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
}

p {
  margin-bottom: 10px;
  color: #333;
}

.error {
  color: red;
  text-align: center;
  margin: 10px 0;
}

.edit-btn {
  background: #007bff;
  color: white;
  padding: 12px 20px;
  width: 100%;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 20px;
  transition: 0.3s;
}

.edit-btn:hover {
  background: #0056b3;
}

/* Modal */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 450px;
  position: relative;
}

.close {
  position: absolute;
  right: 15px;
  top: 10px;
  font-size: 24px;
  cursor: pointer;
}

h3 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  transition: 0.3s;
}

input:focus,
select:focus {
  border-color: #007bff;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn.save {
  background: #28a745;
  color: white;
}

.btn.cancel {
  background: #dc3545;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}
h2 {
  text-align: center;
}
</style>
