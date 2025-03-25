<template>
  <nav class="header">
    <div class="brand">
      <a href="/home" class="brand-link">
        <span>ỨNG DỤNG QUẢN LÝ MƯỢN TRẢ SÁCH</span>
      </a>
    </div>
    <ul class="nav-links">
      <li v-if="isAuthenticated">
        <button @click="logout" class="btn btn-logout">
          <span>Đăng xuất</span> 🔒
        </button>
      </li>
      <template v-else>
        <li>
          <router-link to="/login" class="btn btn-login">Đăng nhập</router-link>
        </li>
        <li>
          <router-link to="/signup" class="btn btn-signup">Đăng ký</router-link>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem("tokenuser");
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("tokenuser");
      localStorage.removeItem("role");
      this.$router.push("/login").then(() => {
        window.location.reload();
      });
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  height: 70px;
  background: linear-gradient(90deg, #212121, #424242);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
  gap: 10px;
}

.brand-link span {
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.logo {
  width: 40px;
  height: 40px;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 15px;
  align-items: center;
  margin: 0;
  padding: 0;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-login {
  background: #4caf50;
  color: #fff;
}

.btn-login:hover {
  background: #43a047;
}

.btn-signup {
  background: #2196f3;
  color: #fff;
}

.btn-signup:hover {
  background: #1e88e5;
}

.btn-logout {
  background: #f44336;
  color: #fff;
  border: none;
}

.btn-logout:hover {
  background: #e53935;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    height: auto;
    padding: 15px;
  }

  .nav-links {
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }

  .brand-link span {
    font-size: 18px;
  }
}
</style>
