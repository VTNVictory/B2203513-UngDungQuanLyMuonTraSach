<template>
  <div class="form-container">
    <div class="docgia-form">
      <h2>Đăng Ký Tài Khoản</h2>
      <form @submit.prevent="submitForm">
        <!-- Khung thông tin độc giả -->
        <fieldset>
          <legend>Thông Tin Đọc Giả</legend>
          <div>
            <label for="hoLot">Họ Lót:</label>
            <input type="text" id="hoLot" v-model="formData.HOLOT" required />
          </div>
          <div>
            <label for="ten">Tên:</label>
            <input type="text" id="ten" v-model="formData.TEN" required />
          </div>
          <div>
            <label for="ngaySinh">Ngày Sinh:</label>
            <input
              type="date"
              id="ngaySinh"
              v-model="formData.NGAYSINH"
              required
            />
          </div>
          <div>
            <label for="phai">Giới tính:</label>
            <select id="phai" v-model="formData.PHAI" required>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <div>
            <label for="diaChi">Địa Chỉ:</label>
            <input type="text" id="diaChi" v-model="formData.DIACHI" required />
          </div>
        </fieldset>

        <!-- Khung thông tin đăng nhập -->
        <fieldset>
          <legend>Thông Tin Đăng Nhập</legend>
          <div>
            <label for="dienThoai">Số Điện Thoại:</label>
            <input
              type="tel"
              id="dienThoai"
              v-model="formData.DIENTHOAI"
              required
              pattern="[0-9]{10}"
            />
          </div>
          <div>
            <label for="password">Mật Khẩu:</label>
            <input
              type="password"
              id="password"
              v-model="formData.PASSWORD"
              required
            />
          </div>
          <div>
            <label for="confirmPassword">Xác Nhận Mật Khẩu:</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="formData.CONFIRMPASSWORD"
              required
            />
          </div>
        </fieldset>

        <!-- Nút đăng ký -->
        <button type="submit">Đăng Ký</button>
      </form>
      <p v-if="message" :class="{ success: success, error: !success }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        MADOCGIA: `DG${Date.now()}`, //Tự động tạo mã đọc giả
        HOLOT: "",
        TEN: "",
        NGAYSINH: "",
        PHAI: "",
        DIACHI: "",
        DIENTHOAI: "",
        PASSWORD: "",
        CONFIRMPASSWORD: "",
      },
      message: "",
      success: false,
    };
  },
  methods: {
    async submitForm() {
      if (this.formData.password !== this.formData.confirmPassword) {
        this.message = "Mật khẩu và xác nhận mật khẩu không khớp.";
        this.success = false;
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:3000/api/docgia",
          this.formData
        );
        if (response.status === 200) {
          alert("Đăng ký thành công!");
          this.resetForm();
        }
      } catch (error) {
        alert("Đăng ký thất bại, vui lòng thử lại!");
      }
    },
    resetForm() {
      this.formData = {
        MADOCGIA: `DG${Date.now()}`, //Reset mã mới
        HOLOT: "",
        TEN: "",
        NGAYSINH: "",
        PHAI: "",
        DIACHI: "",
        DIENTHOAI: "",
        PASSWORD: "",
        CONFIRMPASSWORD: "",
      };
    },
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
