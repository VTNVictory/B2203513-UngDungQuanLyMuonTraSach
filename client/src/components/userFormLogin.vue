<template>
  <div class="form-container">
    <div class="login-form">
      <h2>Đăng Nhập</h2>
      <form @submit.prevent="submitLogin">
        <!-- Số điện thoại -->
        <div>
          <label for="dienThoai">Số Điện Thoại:</label>
          <input
            type="tel"
            id="dienThoai"
            v-model="loginData.DIENTHOAI"
            required
            pattern="[0-9]{10}"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <!-- Mật khẩu -->
        <div>
          <label for="password">Mật Khẩu:</label>
          <input
            type="password"
            id="password"
            v-model="loginData.PASSWORD"
            required
            placeholder="Nhập mật khẩu"
          />
        </div>

        <!-- Nút đăng nhập -->
        <button type="submit">Đăng Nhập</button>
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
      loginData: {
        DIENTHOAI: "", // Số điện thoại
        PASSWORD: "", // Mật khẩu
      },
      message: "",
      success: false,
    };
  },
  methods: {
    async submitLogin() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/docgia/login",
          this.loginData
        );
        if (response.status === 200) {
          // // Lưu thông tin người dùng (có thể dùng localStorage hoặc Vuex)
          localStorage.setItem(
            "tokenuser",
            JSON.stringify(response.data.token)
          );
          localStorage.setItem("role", JSON.stringify(response.data.role));

          // Chuyển hướng sau khi đăng nhập thành công
          this.$router.push("/home").then(() => {
            window.location.reload();
          });
          this.message = "Đăng nhập thành công!";
          this.success = true;
        }
      } catch (error) {
        this.message = "Đăng nhập thất bại, vui lòng thử lại!";
        this.success = false;
      }
    },
  },
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>
