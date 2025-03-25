<template>
  <aside :class="{ 'is-expanded': is_expanded }">
    <div class="logo">
      <img src="/favicon.ico" alt="logo" />
    </div>

    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <span class="material-icons">keyboard_double_arrow_right</span>
      </button>
    </div>

    <h3>Menu</h3>
    <div class="menu">
      <!-- Nhân viên -->
      <template v-if="role === 'nhanvien'">
        <router-link class="button" to="/admin/dashboard">
          <span class="material-icons">dashboard</span>
          <span class="text">Tổng quan</span>
        </router-link>
        <router-link class="button" to="/admin/sach">
          <span class="material-icons">menu_book</span>
          <span class="text">Quản lý sách</span>
        </router-link>
        <router-link class="button" to="/admin/theodoi">
          <span class="material-icons">autorenew</span>
          <span class="text">Quản lý phiếu mượn</span>
        </router-link>
        <router-link class="button" :to="`/profile/${userId}`">
          <span class="material-icons">account_circle</span>
          <span class="text">Tài khoản</span>
        </router-link>
      </template>

      <!-- Độc giả -->
      <template v-if="role === 'docgia'">
        <router-link class="button" to="/home">
          <span class="material-icons">home</span>
          <span class="text">Trang chủ</span>
        </router-link>
        <router-link class="button" :to="`/history/${userId}`">
          <span class="material-icons">history</span>
          <span class="text">Lịch sử mượn sách</span>
        </router-link>
        <router-link class="button" :to="`/profile/${userId}`">
          <span class="material-icons">account_circle</span>
          <span class="text">Tài khoản</span>
        </router-link>
      </template>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getUserDataFromToken } from "@/services/getUserData.service";

const router = useRouter();
const is_expanded = ref(localStorage.getItem("is_expanded") === "true");

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value;
  localStorage.setItem("is_expanded", is_expanded.value);
};

const role = computed(() => {
  return JSON.parse(localStorage.getItem("role"));
});

const userId = ref(null);

onMounted(async () => {
  const user = await getUserDataFromToken();
  if (user._id) {
    userId.value = user._id;
  }
});
</script>

<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;
  width: calc(2rem + 32px);
  min-height: 100vh;
  overflow: hidden;
  padding: 1rem;
  background-color: var(--dark);
  color: var(--light);
  transition: 0.2s ease-out;

  .logo {
    margin-bottom: 1rem;
    img {
      width: 2rem;
    }
  }

  .menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    position: relative;
    top: 0;
    transition: 0.2 ease-out;

    .menu-toggle {
      background: none;
      border: none;
      outline: none;
      box-shadow: none;
      padding: 0.25rem;
      border-radius: 50%;
      cursor: pointer;
      transition: 0.3s ease;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.3s ease;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        .material-icons {
          color: var(--primary);
          transform: translateX(0.5rem);
        }
      }

      &:focus {
        outline: none;
        box-shadow: none;
      }
    }
  }

  h3,
  .button .text {
    opacity: 0;
    transition: 0.3s ease-out;
  }

  &:not(.is-expanded) .text {
    display: none;
  }

  h3 {
    color: var(--grey);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .menu {
    margin: 0 -1rem;
    .button {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: 0.5rem 1rem;
      transition: 0.2s ease-out;
      cursor: pointer;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        margin-right: 1rem;
        transition: 0.2s ease-out;
      }

      .text {
        color: var(--light);
        transition: 0.2s ease-out;
      }

      &:hover {
        background-color: var(--dark-alt);

        .material-icons,
        .text {
          color: var(--primary);
        }
      }
    }

    .button.router-link-exact-active {
      background-color: var(--dark-alt);
      border-right: 5px solid var(--primary);

      .material-icons,
      .text {
        color: var(--primary);
      }
    }
  }

  &.is-expanded {
    width: var(--sidebar-width);

    .menu-toggle-wrap {
      top: -3rem;
      .menu-toggle {
        transform: rotate(-180deg);
      }
    }

    h3,
    .button,
    .text {
      opacity: 1;
    }

    .text {
      display: inline;
    }

    .button {
      .material-icons {
        margin-right: 1rem;
      }
    }
  }

  @media (max-width: 768px) {
    position: fixed;
    z-index: 99;
  }
}
</style>
