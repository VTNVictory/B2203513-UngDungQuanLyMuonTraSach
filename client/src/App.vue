<template>
  <div class="app-container">
    <!-- Sidebar sát viền trên cùng -->
    <Sidebar />

    <!-- Phần còn lại chứa Header + nội dung -->
    <div class="content-container">
      <Header />
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/header.vue";
import { ref } from "vue";

const is_expanded = ref(localStorage.getItem("is_expanded") === "true");

window.addEventListener("storage", () => {
  is_expanded.value = localStorage.getItem("is_expanded") === "true";
});
</script>

<style scoped>
:root {
  --sidebar-width: 250px;
  --sidebar-collapsed: calc(2rem + 32px);
}

.app-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar full chiều cao bên trái */
Sidebar {
  height: 100vh;
}

/* Nội dung phía bên phải */
.content-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Header chỉ nằm trong content-container */
header {
  width: 100%;
  z-index: 10;
  background: #343a40;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Main content */
.main-content {
  flex: 1;
  padding: 20px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style>
