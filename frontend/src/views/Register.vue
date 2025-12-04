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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Create Account</h2>
          <p class="text-gray-600 mt-2">Join LuxeShop today</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label
              for="register-name"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Full Name</label
            >
            <input
              id="register-name"
              v-model="name"
              type="text"
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="John Doe"
              @input="clearError('name')"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">
              {{ errors.name }}
            </p>
          </div>

          <div>
            <label
              for="register-email"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Email Address</label
            >
            <input
              id="register-email"
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
              for="register-password"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Password</label
            >
            <input
              id="register-password"
              v-model="password"
              type="password"
              required
              minlength="6"
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
            <p v-else class="mt-1 text-xs text-gray-500">
              Must be at least 6 characters
            </p>
          </div>

          <div>
            <label
              for="register-confirm-password"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Confirm Password</label
            >
            <input
              id="register-confirm-password"
              v-model="confirmPassword"
              type="password"
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                errors.confirmPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="••••••••"
              @input="clearError('confirmPassword')"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <div>
            <label
              for="register-role"
              class="block text-sm font-medium text-gray-700 mb-2"
              >I am a</label
            >
            <select
              id="register-role"
              v-model="role"
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white',
                errors.role
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              @change="clearError('role')"
            >
              <option value="" disabled>Select your role</option>
              <option value="parent">Parent</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <p v-if="errors.role" class="mt-1 text-sm text-red-600">
              {{ errors.role }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              Choose the role that best describes you
            </p>
          </div>

          <div class="flex items-start">
            <input
              v-model="agreedToTerms"
              type="checkbox"
              required
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
            />
            <label class="ml-2 text-sm text-gray-600">
              I agree to the
              <a href="#" class="text-blue-600 hover:text-blue-700"
                >Terms of Service</a
              >
              and
              <a href="#" class="text-blue-600 hover:text-blue-700"
                >Privacy Policy</a
              >
            </label>
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
            <span v-if="isLoading">Creating account...</span>
            <span v-else>Create Account</span>
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

        <!-- Sign in link -->
        <p class="mt-8 text-center text-sm text-gray-600">
          Already have an account?
          <router-link
            to="/login"
            class="font-medium text-blue-600 hover:text-blue-700"
            >Sign in</router-link
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
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const role = ref("");
const agreedToTerms = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const errors = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
});

const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = "";
  }
  if (errorMessage.value) {
    errorMessage.value = "";
  }
};

const validateForm = () => {
  let isValid = true;
  errors.value = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  };

  // Name validation
  if (!name.value || name.value.trim().length < 2) {
    errors.value.name = "Name must be at least 2 characters";
    isValid = false;
  }

  // Email validation
  if (!email.value) {
    errors.value.email = "Email is required";
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      errors.value.email = "Please enter a valid email address";
      isValid = false;
    }
  }

  // Password validation
  if (!password.value) {
    errors.value.password = "Password is required";
    isValid = false;
  } else if (password.value.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
    isValid = false;
  }

  // Confirm password validation
  if (!confirmPassword.value) {
    errors.value.confirmPassword = "Please confirm your password";
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  // Role validation
  if (!role.value) {
    errors.value.role = "Please select your role";
    isValid = false;
  } else if (!["parent", "student", "teacher"].includes(role.value)) {
    errors.value.role = "Please select a valid role";
    isValid = false;
  }

  // Terms validation
  if (!agreedToTerms.value) {
    errorMessage.value = "Please agree to the terms and conditions";
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  // Reset errors
  errorMessage.value = "";

  // Validate form
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    const response = await apiService.register({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: role.value,
    });

    if (response.success && response.data) {
      // Update store with user data
      store.user = response.data.user;
      store.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to home
      router.push("/");
    } else {
      errorMessage.value =
        response.message || "Registration failed. Please try again.";
    }
  } catch (error) {
    console.error("Registration error:", error);

    // Handle validation errors from backend
    if (error.response && error.response.errors) {
      // Map validation errors to form fields
      error.response.errors.forEach((err) => {
        if (err.path === "name") {
          errors.value.name = err.msg;
        } else if (err.path === "email") {
          errors.value.email = err.msg;
        } else if (err.path === "password") {
          errors.value.password = err.msg;
        } else if (err.path === "role") {
          errors.value.role = err.msg;
        }
      });
      errorMessage.value = "Please fix the errors above.";
    } else if (error.message && error.message.includes("already exists")) {
      errors.value.email = "An account with this email already exists";
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
