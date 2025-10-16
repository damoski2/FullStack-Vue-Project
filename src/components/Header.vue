<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <!-- Top bar -->
      <div class="flex items-center justify-between py-4">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
          </div>
          <span
            class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >LuxeShop</span
          >
        </router-link>

        <!-- Search bar -->
        <div class="hidden md:flex flex-1 max-w-xl mx-8">
          <div class="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              class="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-6">
          <!-- User menu -->
          <router-link
            v-if="!store.isLoggedIn"
            to="/login"
            class="hidden md:flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span>Login</span>
          </router-link>

          <div
            v-else
            class="hidden md:flex items-center space-x-2 text-gray-700"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span>{{ store.user.name }}</span>
            <button
              @click="handleLogout"
              class="ml-2 text-sm text-gray-500 hover:text-red-600"
            >
              Logout
            </button>
          </div>

          <!-- Cart -->
          <router-link
            to="/cart"
            class="relative flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartCount }}
            </span>
          </router-link>

          <!-- Mobile menu button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav
        class="hidden md:flex items-center space-x-8 py-3 border-t border-gray-200"
      >
        <router-link
          to="/"
          class="text-gray-700 hover:text-blue-600 font-medium"
          >Home</router-link
        >
        <router-link
          to="/lessons"
          class="text-gray-700 hover:text-blue-600 font-medium"
          >🎓 Lessons</router-link
        >
        <a
          href="#"
          @click.prevent="filterByCategory('Electronics')"
          class="text-gray-700 hover:text-blue-600"
          >Electronics</a
        >
        <a
          href="#"
          @click.prevent="filterByCategory('Fashion')"
          class="text-gray-700 hover:text-blue-600"
          >Fashion</a
        >
        <a
          href="#"
          @click.prevent="filterByCategory('all')"
          class="text-gray-700 hover:text-blue-600"
          >All Products</a
        >
      </nav>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-t border-gray-200 py-4 px-4 space-y-4"
    >
      <router-link
        to="/"
        @click="mobileMenuOpen = false"
        class="block text-gray-700 hover:text-blue-600"
        >Home</router-link
      >
      <router-link
        to="/lessons"
        @click="mobileMenuOpen = false"
        class="block text-gray-700 hover:text-blue-600"
        >🎓 Lessons</router-link
      >
      <a
        href="#"
        @click.prevent="
          filterByCategory('Electronics');
          mobileMenuOpen = false;
        "
        class="block text-gray-700 hover:text-blue-600"
        >Electronics</a
      >
      <a
        href="#"
        @click.prevent="
          filterByCategory('Fashion');
          mobileMenuOpen = false;
        "
        class="block text-gray-700 hover:text-blue-600"
        >Fashion</a
      >
      <router-link
        v-if="!store.isLoggedIn"
        to="/login"
        @click="mobileMenuOpen = false"
        class="block text-gray-700 hover:text-blue-600"
        >Login</router-link
      >
      <button
        v-else
        @click="handleLogout"
        class="block w-full text-left text-gray-700 hover:text-blue-600"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import store from "../store";

const router = useRouter();
const mobileMenuOpen = ref(false);

const cartCount = computed(() => store.getCartCount());

const filterByCategory = (category) => {
  router.push({ path: "/", query: { category } });
};

const handleLogout = () => {
  store.logout();
  mobileMenuOpen.value = false;
  router.push("/");
};
</script>
