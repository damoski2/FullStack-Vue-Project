import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LessonDetail from "../views/LessonDetail.vue";
import Cart from "../views/Cart.vue";
import Checkout from "../views/Checkout.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import TeacherProfile from "../views/TeacherProfile.vue";
import store from "../store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/lesson/:id",
    name: "LessonDetail",
    component: LessonDetail,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: Checkout,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/teacher-profile",
    name: "TeacherProfile",
    component: TeacherProfile,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Navigation guards
router.beforeEach((to, from, next) => {
  // Ensure store is initialized
  if (!store.user && localStorage.getItem("token")) {
    store.loadUser();
  }

  // Protected routes - require authentication
  const protectedRoutes = ["/cart", "/checkout", "/teacher-profile"];
  const isProtectedRoute = protectedRoutes.includes(to.path);

  // Auth routes - redirect if already logged in
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(to.path);

  // Teacher-only routes
  const teacherRoutes = ["/teacher-profile"];
  const isTeacherRoute = teacherRoutes.includes(to.path);

  // Check if user is logged in
  const isLoggedIn = store.isLoggedIn || !!localStorage.getItem("token");

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    next("/");
    return;
  }

  // Redirect non-logged-in users away from protected pages
  if (isProtectedRoute && !isLoggedIn) {
    next("/login");
    return;
  }

  // Check teacher role for teacher-only routes
  if (isTeacherRoute && isLoggedIn) {
    const userRole =
      store.user?.role || JSON.parse(localStorage.getItem("user") || "{}").role;
    if (userRole !== "teacher") {
      next("/");
      return;
    }
  }

  next();
});

export default router;
