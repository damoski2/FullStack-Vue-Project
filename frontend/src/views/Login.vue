<template>
  <div
    class="min-h-[calc(100vh-300px)] flex items-center justify-center px-4 py-12"
  >
    <div class="max-w-md w-full">
      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4"
          >
            <svg
              class="w-8 h-8 text-white"
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
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p class="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label
              for="login-email"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Email Address</label
            >
            <input
              id="login-email"
              v-model="email"
              type="email"
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="you@example.com"
              @input="clearError('email')"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label
              for="login-password"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Password</label
            >
            <input
              id="login-password"
              v-model="password"
              type="password"
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="••••••••"
              @input="clearError('password')"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-700"
              >Forgot password?</a
            >
          </div>

          <div
            v-if="errorMessage"
            class="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            :class="[
              'w-full text-white py-3 rounded-lg font-semibold transition-colors',
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700',
            ]"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-4">
          <button
            type="button"
            class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span class="ml-2 text-sm font-medium text-gray-700">Google</span>
          </button>

          <button
            type="button"
            class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            <span class="ml-2 text-sm font-medium text-gray-700">Facebook</span>
          </button>
        </div>

        <!-- Sign up link -->
        <p class="mt-8 text-center text-sm text-gray-600">
          Don't have an account?
          <router-link
            to="/register"
            class="font-medium text-blue-600 hover:text-blue-700"
            >Sign up</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import store from "../store";
import apiService from "../services/api.js";

const router = useRouter();
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const errors = ref({
  email: "",
  password: "",
});

const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = "";
  }
  if (errorMessage.value) {
    errorMessage.value = "";
  }
};

const handleLogin = async () => {
  // Reset errors
  errorMessage.value = "";
  errors.value = {
    email: "",
    password: "",
  };

  // Basic validation
  if (!email.value) {
    errors.value.email = "Email is required";
    return;
  }

  if (!password.value) {
    errors.value.password = "Password is required";
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errors.value.email = "Please enter a valid email address";
    return;
  }

  isLoading.value = true;

  try {
    const response = await apiService.login({
      email: email.value,
      password: password.value,
    });

    if (response.success && response.data) {
      // Update store with user data
      store.user = response.data.user;
      store.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Load user (which will sync cart from localStorage to backend)
      await store.loadUser();

      // Redirect to home
      router.push("/");
    } else {
      errorMessage.value =
        response.message || "Login failed. Please try again.";
    }
  } catch (error) {
    console.error("Login error:", error);

    // Handle validation errors from backend
    if (error.response && error.response.errors) {
      // Map validation errors to form fields
      error.response.errors.forEach((err) => {
        if (err.path === "email") {
          errors.value.email = err.msg;
        } else if (err.path === "password") {
          errors.value.password = err.msg;
        }
      });
      errorMessage.value = "Please fix the errors above.";
    } else if (error.message && error.message.includes("Invalid")) {
      errorMessage.value = "Invalid email or password. Please try again.";
    } else {
      errorMessage.value =
        error.message || "An error occurred. Please try again later.";
    }
  } finally {
    isLoading.value = false;
  }
};

// Redirect if already logged in
onMounted(() => {
  // Check if user is logged in
  const token = localStorage.getItem("token");
  const user =
    store.user ||
    (localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null);

  if (token && user) {
    // User is already logged in, redirect to home
    router.push("/");
  } else if (token) {
    // Token exists but user data not loaded, try to load user
    store.loadUser().then(() => {
      if (store.isLoggedIn) {
        router.push("/");
      }
    });
  }
});
</script>
