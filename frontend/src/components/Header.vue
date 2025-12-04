<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <!-- Top bar -->
      <div class="flex items-center justify-between py-4">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div
            class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center"
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
          </div>
          <span
            class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >AfterSchool Hub</span
          >
        </router-link>

        <!-- Search bar -->
        <div class="hidden md:flex flex-1 max-w-xl mx-8">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search classes, teachers, subjects..."
              class="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @input="handleSearchInput"
              @keyup.enter="handleSearch"
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
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-6">
          <!-- User menu -->
          <router-link
            v-if="!store.isLoggedIn"
            to="/login"
            class="hidden md:flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
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
            class="hidden md:flex items-center space-x-4 text-gray-700"
          >
            <!-- Teacher Profile Link -->
            <router-link
              v-if="store.user && store.user.role === 'teacher'"
              to="/teacher-profile"
              class="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors"
              title="Teacher Profile"
            >
              <svg
                class="w-5 h-5"
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
              <span class="text-sm">Profile</span>
            </router-link>

            <div class="flex items-center space-x-2">
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
            </div>
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
            class="relative flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
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
          class="text-gray-700 hover:text-indigo-600 font-medium"
          >Home</router-link
        >
        <a
          href="#"
          @click.prevent="filterByCategory('Music')"
          class="text-gray-700 hover:text-indigo-600"
          >🎵 Music</a
        >
        <a
          href="#"
          @click.prevent="filterByCategory('Math')"
          class="text-gray-700 hover:text-indigo-600"
          >🧮 Math & Science</a
        >
        <a
          href="#"
          @click.prevent="filterByCategory('Sports')"
          class="text-gray-700 hover:text-indigo-600"
          >⚽ Sports</a
        >
        <a
          href="#"
          @click.prevent="filterByCategory('Art')"
          class="text-gray-700 hover:text-indigo-600"
          >🎨 Art</a
        >
        <a
          href="#"
          @click.prevent="filterByCategory('Technology')"
          class="text-gray-700 hover:text-indigo-600"
          >💻 Technology</a
        >
        <a
          href="#"
          @click.prevent="filterByCategory('all')"
          class="text-gray-700 hover:text-indigo-600"
          >All Classes</a
        >
      </nav>
    </div>

    <!-- Mobile Search -->
    <div class="md:hidden border-t border-gray-200 py-3 px-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search classes, teachers, subjects..."
          class="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @input="handleSearchInput"
          @keyup.enter="handleSearch"
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
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-t border-gray-200 py-4 px-4 space-y-4"
    >
      <router-link
        to="/"
        @click="mobileMenuOpen = false"
        class="block text-gray-700 hover:text-indigo-600"
        >Home</router-link
      >
      <a
        href="#"
        @click.prevent="
          filterByCategory('Music');
          mobileMenuOpen = false;
        "
        class="block text-gray-700 hover:text-indigo-600"
        >🎵 Music</a
      >
      <a
        href="#"
        @click.prevent="
          filterByCategory('Math');
          mobileMenuOpen = false;
        "
        class="block text-gray-700 hover:text-indigo-600"
        >🧮 Math & Science</a
      >
      <a
        href="#"
        @click.prevent="
          filterByCategory('Sports');
          mobileMenuOpen = false;
        "
        class="block text-gray-700 hover:text-indigo-600"
        >⚽ Sports</a
      >
      <a
        href="#"
        @click.prevent="
          filterByCategory('Art');
          mobileMenuOpen = false;
        "
        class="block text-gray-700 hover:text-indigo-600"
        >🎨 Art</a
      >
      <a
        href="#"
        @click.prevent="
          filterByCategory('Technology');
          mobileMenuOpen = false;
        "
        class="block text-gray-700 hover:text-indigo-600"
        >💻 Technology</a
      >
      <router-link
        v-if="!store.isLoggedIn"
        to="/login"
        @click="mobileMenuOpen = false"
        class="block text-gray-700 hover:text-indigo-600"
        >Login</router-link
      >
      <div v-else class="space-y-2">
        <router-link
          v-if="store.user && store.user.role === 'teacher'"
          to="/teacher-profile"
          @click="mobileMenuOpen = false"
          class="block text-gray-700 hover:text-indigo-600"
        >
          Teacher Profile
        </router-link>
        <button
          @click="handleLogout"
          class="block w-full text-left text-gray-700 hover:text-indigo-600"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "../store";

const router = useRouter();
const route = useRoute();
const mobileMenuOpen = ref(false);
const searchQuery = ref("");

const cartCount = computed(() => store.getCartCount());

// Refresh cart count on mount
onMounted(async () => {
  // Always load from localStorage first
  store.loadCartItems();
  // Then sync with API if logged in
  if (store.isLoggedIn) {
    await store.refreshCartCount();
  }
});

// Initialize search query from route
if (route.query.search) {
  searchQuery.value = route.query.search;
}

// Watch for route changes to update search query
watch(
  () => route.query.search,
  (newSearch) => {
    searchQuery.value = newSearch || "";
  }
);

let searchTimeout = null;

const handleSearchInput = () => {
  // Debounce search
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    handleSearch();
  }, 500); // Wait 500ms after user stops typing
};

const handleSearch = () => {
  const query = { ...route.query };

  if (searchQuery.value.trim()) {
    query.search = searchQuery.value.trim();
  } else {
    delete query.search;
  }

  // Reset to page 1 when searching
  delete query.page;

  router.push({ path: "/", query });
};

const clearSearch = () => {
  searchQuery.value = "";
  const query = { ...route.query };
  delete query.search;
  router.push({ path: "/", query });
};

const filterByCategory = (category) => {
  const query = { ...route.query };
  if (category === "all") {
    delete query.category;
  } else {
    query.category = category;
  }
  // Clear search when filtering by category
  delete query.search;
  searchQuery.value = "";
  router.push({ path: "/", query });
};

const handleLogout = () => {
  store.logout();
  mobileMenuOpen.value = false;
  router.push("/");
};
</script>
