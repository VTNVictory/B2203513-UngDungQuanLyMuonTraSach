import { createWebHistory, createRouter } from "vue-router";

import Signup from "@/components/userFormSignUp.vue";
import Login from "@/components/userFormLogin.vue";
import UserHome from "@/views/userHome.vue";
import UserHistory from "@/components/userHistory.vue";

import AdminLogin from "@/components/adminFormLogin.vue";
import AdminDashBoard from "@/components/adminDashboard.vue";
import AdminBook from "@/views/adminPageBook.vue";
import AdminBorrowMan from "@/components/adminBorrowManagement.vue";

import Profile from "@/components/profile.vue";
const routes = [
    {
        path: "/signup",
        name: "signup",
        component: Signup,
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/home',
        name: 'Home',
        component: UserHome,
    },
    {
        path: '/history/:id',
        name: 'userhistory',
        component: UserHistory,
    },
    {
        path: '/admin/login',
        name: 'adminlogin',
        component: AdminLogin,
    },
    {
        path: '/admin/dashboard',
        name: 'admindashboard',
        component: AdminDashBoard,
    },
    {
        path: '/admin/sach',
        name: 'adminbook',
        component: AdminBook,
    },
    {
        path: '/admin/theodoi',
        name: 'adminborrowmanagement',
        component: AdminBorrowMan,
    },
    {
        path: '/profile/:id',
        name: 'userprofile',
        component: Profile,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    }
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
export default router;