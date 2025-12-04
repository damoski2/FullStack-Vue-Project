<template>
  <div class="min-h-[calc(100vh-300px)] py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Teacher Profile</h1>
        <p class="text-gray-600 mt-2">
          Complete your teacher profile to start offering lessons
        </p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title -->
          <div>
            <label
              for="teacher-title"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Professional Title <span class="text-red-500">*</span>
            </label>
            <input
              id="teacher-title"
              v-model="formData.title"
              type="text"
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="e.g., Concert Pianist, Professional Artist, PhD Mathematics"
              @input="clearError('title')"
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">
              {{ errors.title }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              Your professional title or qualification
            </p>
          </div>

          <!-- Bio -->
          <div>
            <label
              for="teacher-bio"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Bio
            </label>
            <textarea
              id="teacher-bio"
              v-model="formData.bio"
              rows="4"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none',
                errors.bio
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Tell us about your teaching experience, philosophy, and what makes your lessons special..."
              @input="clearError('bio')"
            ></textarea>
            <p v-if="errors.bio" class="mt-1 text-sm text-red-600">
              {{ errors.bio }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              {{ formData.bio.length }}/1000 characters
            </p>
          </div>

          <!-- Credentials -->
          <div>
            <label
              for="teacher-credentials"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Credentials & Qualifications
            </label>
            <textarea
              id="teacher-credentials"
              v-model="formData.credentials"
              rows="3"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none',
                errors.credentials
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="e.g., Bachelor of Music, Certified Teacher, Professional License..."
              @input="clearError('credentials')"
            ></textarea>
            <p v-if="errors.credentials" class="mt-1 text-sm text-red-600">
              {{ errors.credentials }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              List your educational background, certifications, and
              qualifications
            </p>
          </div>

          <!-- Experience Years -->
          <div>
            <label
              for="teacher-experience"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Years of Experience
            </label>
            <input
              id="teacher-experience"
              v-model.number="formData.experience_years"
              type="number"
              min="0"
              max="50"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                errors.experience_years
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="0"
              @input="clearError('experience_years')"
            />
            <p v-if="errors.experience_years" class="mt-1 text-sm text-red-600">
              {{ errors.experience_years }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              Number of years you've been teaching
            </p>
          </div>

          <!-- Avatar URL -->
          <div>
            <label
              for="teacher-avatar"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Profile Picture URL
            </label>
            <input
              id="teacher-avatar"
              v-model="formData.avatar"
              type="url"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                errors.avatar
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="https://example.com/your-photo.jpg"
              @input="clearError('avatar')"
            />
            <p v-if="errors.avatar" class="mt-1 text-sm text-red-600">
              {{ errors.avatar }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              URL to your profile picture (optional)
            </p>
            <!-- Avatar Preview -->
            <div v-if="formData.avatar && !errors.avatar" class="mt-3">
              <p class="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                :src="formData.avatar"
                alt="Avatar preview"
                class="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                @error="handleImageError"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- Success Message -->
          <div
            v-if="successMessage"
            class="p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              :class="[
                'flex-1 text-white py-3 rounded-lg font-semibold transition-colors',
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700',
              ]"
            >
              <span v-if="isLoading">
                {{ isCreating ? "Creating..." : "Updating..." }}
              </span>
              <span v-else>
                {{ isCreating ? "Create Profile" : "Update Profile" }}
              </span>
            </button>
            <button
              type="button"
              @click="router.push('/')"
              class="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { onBeforeMount } from "vue";
import apiService from "../services/api.js";
import store from "../store";

const router = useRouter();

const formData = ref({
  title: "",
  bio: "",
  credentials: "",
  experience_years: 0,
  avatar: "",
});

const isLoading = ref(false);
const isCreating = ref(true);
const errorMessage = ref("");
const successMessage = ref("");
const errors = ref({
  title: "",
  bio: "",
  credentials: "",
  experience_years: "",
  avatar: "",
});

const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = "";
  }
  if (errorMessage.value) {
    errorMessage.value = "";
  }
  if (successMessage.value) {
    successMessage.value = "";
  }
};

const handleImageError = (event) => {
  event.target.style.display = "none";
};

const loadTeacherProfile = async () => {
  try {
    const response = await apiService.getTeacherProfile();
    if (response.success && response.data.teacher) {
      const teacher = response.data.teacher;
      formData.value = {
        title: teacher.title || "",
        bio: teacher.bio || "",
        credentials: teacher.credentials || "",
        experience_years: teacher.experience_years || 0,
        avatar: teacher.avatar || "",
      };
      isCreating.value = false;
    }
  } catch (error) {
    console.error("Error loading teacher profile:", error);
    // If profile doesn't exist, that's fine - we'll create it
    isCreating.value = true;
  }
};

const handleSubmit = async () => {
  // Reset messages
  errorMessage.value = "";
  successMessage.value = "";
  errors.value = {
    title: "",
    bio: "",
    credentials: "",
    experience_years: "",
    avatar: "",
  };

  // Basic validation
  if (!formData.value.title || formData.value.title.trim().length < 2) {
    errors.value.title = "Title must be at least 2 characters";
    return;
  }

  if (formData.value.bio && formData.value.bio.length > 1000) {
    errors.value.bio = "Bio must be less than 1000 characters";
    return;
  }

  if (formData.value.credentials && formData.value.credentials.length > 500) {
    errors.value.credentials = "Credentials must be less than 500 characters";
    return;
  }

  if (
    formData.value.experience_years < 0 ||
    formData.value.experience_years > 50
  ) {
    errors.value.experience_years = "Experience must be between 0 and 50 years";
    return;
  }

  isLoading.value = true;

  try {
    let response;
    if (isCreating.value) {
      response = await apiService.createTeacherProfile({
        title: formData.value.title.trim(),
        bio: formData.value.bio.trim() || "",
        credentials: formData.value.credentials.trim() || "",
        experience_years: formData.value.experience_years || 0,
        avatar: formData.value.avatar.trim() || "",
      });
    } else {
      response = await apiService.updateTeacherProfile({
        title: formData.value.title.trim(),
        bio: formData.value.bio.trim() || "",
        credentials: formData.value.credentials.trim() || "",
        experience_years: formData.value.experience_years || 0,
        avatar: formData.value.avatar.trim() || "",
      });
    }

    if (response.success) {
      successMessage.value = isCreating.value
        ? "Teacher profile created successfully!"
        : "Teacher profile updated successfully!";
      isCreating.value = false;

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      errorMessage.value =
        response.message || "Failed to save profile. Please try again.";
    }
  } catch (error) {
    console.error("Save teacher profile error:", error);

    // Handle validation errors from backend
    if (error.response && error.response.errors) {
      error.response.errors.forEach((err) => {
        if (err.path === "title") {
          errors.value.title = err.msg;
        } else if (err.path === "bio") {
          errors.value.bio = err.msg;
        } else if (err.path === "credentials") {
          errors.value.credentials = err.msg;
        } else if (err.path === "experience_years") {
          errors.value.experience_years = err.msg;
        } else if (err.path === "avatar") {
          errors.value.avatar = err.msg;
        }
      });
      errorMessage.value = "Please fix the errors above.";
    } else {
      errorMessage.value =
        error.message || "An error occurred. Please try again later.";
    }
  } finally {
    isLoading.value = false;
  }
};

onBeforeMount(() => {
  // Check if user is logged in
  const token = localStorage.getItem("token");
  const user =
    store.user ||
    (localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null);

  if (!token || !user) {
    router.push("/login");
    return;
  }

  // Ensure user data is loaded
  if (!store.isLoggedIn && token) {
    store.loadUser().then(() => {
      if (!store.user || store.user.role !== "teacher") {
        router.push("/");
      }
    });
    return;
  }

  // Check if user is a teacher
  if (store.user && store.user.role !== "teacher") {
    router.push("/");
    return;
  }

  // Also check localStorage user role
  if (user && user.role !== "teacher") {
    router.push("/");
    return;
  }
});

onMounted(() => {
  loadTeacherProfile();
});
</script>
