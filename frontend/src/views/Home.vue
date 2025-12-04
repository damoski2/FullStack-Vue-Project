<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div
      class="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 md:p-12 mb-12 text-white"
    >
      <div class="max-w-3xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          After School Classes & Activities
        </h1>
        <p class="text-lg md:text-xl mb-6 text-indigo-100">
          Discover amazing learning opportunities for your child. From music and
          sports to coding and art - help them explore their passions after
          school!
        </p>
        <div class="flex flex-wrap gap-4">
          <button
            @click="scrollToClasses"
            class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Browse Classes
          </button>
          <button
            @click="$router.push('/register')"
            class="bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-400 transition-colors border-2 border-white"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>

    <!-- Search Results Indicator -->
    <div
      v-if="route.query.search"
      class="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <svg
          class="w-5 h-5 text-indigo-600"
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
        <span class="text-indigo-700 font-medium">
          Search results for: "{{ route.query.search }}"
        </span>
        <span class="text-indigo-600 text-sm">
          ({{ filteredLessons.length }}
          {{ filteredLessons.length === 1 ? "result" : "results" }})
        </span>
      </div>
      <button
        @click="clearSearch"
        class="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
      >
        Clear
      </button>
    </div>

    <!-- Filter buttons -->
    <div class="flex flex-wrap gap-4 mb-8" ref="classesSection">
      <button
        @click="selectedCategory = 'all'"
        :class="
          selectedCategory === 'all'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        "
        class="px-6 py-2 rounded-lg font-medium transition-colors border border-gray-200"
      >
        All Classes
      </button>
      <button
        @click="selectedCategory = 'Music'"
        :class="
          selectedCategory === 'Music'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        "
        class="px-6 py-2 rounded-lg font-medium transition-colors border border-gray-200"
      >
        🎵 Music
      </button>
      <button
        @click="selectedCategory = 'Math'"
        :class="
          selectedCategory === 'Math'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        "
        class="px-6 py-2 rounded-lg font-medium transition-colors border border-gray-200"
      >
        🧮 Math
      </button>
      <button
        @click="selectedCategory = 'Science'"
        :class="
          selectedCategory === 'Science'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        "
        class="px-6 py-2 rounded-lg font-medium transition-colors border border-gray-200"
      >
        🔬 Science
      </button>
      <button
        @click="selectedCategory = 'Sports'"
        :class="
          selectedCategory === 'Sports'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        "
        class="px-6 py-2 rounded-lg font-medium transition-colors border border-gray-200"
      >
        ⚽ Sports
      </button>
      <button
        @click="selectedCategory = 'Art'"
        :class="
          selectedCategory === 'Art'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        "
        class="px-6 py-2 rounded-lg font-medium transition-colors border border-gray-200"
      >
        🎨 Art
      </button>
      <button
        @click="selectedCategory = 'Technology'"
        :class="
          selectedCategory === 'Technology'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        "
        class="px-6 py-2 rounded-lg font-medium transition-colors border border-gray-200"
      >
        💻 Technology
      </button>
      <button
        @click="selectedCategory = 'Language'"
        :class="
          selectedCategory === 'Language'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        "
        class="px-6 py-2 rounded-lg font-medium transition-colors border border-gray-200"
      >
        🗣️ Language
      </button>
    </div>

    <!-- Sort and Filter Controls -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label for="sort-by" class="text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort-by"
            v-model="sortBy"
            @change="handleSortChange"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
          >
            <option value="createdAt">Newest First</option>
            <option value="price">Price</option>
            <option value="subject">Subject</option>
            <option value="location">Location</option>
            <option value="spaces">Spaces Available</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Order:</span>
          <div class="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              @click="setSortOrder('asc')"
              :class="[
                'px-4 py-2 text-sm font-medium transition-colors',
                sortOrder === 'asc'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
              ]"
            >
              Ascending
            </button>
            <button
              @click="setSortOrder('desc')"
              :class="[
                'px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300',
                sortOrder === 'desc'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
              ]"
            >
              Descending
            </button>
          </div>
        </div>
      </div>
      <div v-if="filteredLessons.length > 0" class="text-sm text-gray-600">
        Showing {{ filteredLessons.length }} class{{
          filteredLessons.length !== 1 ? "es" : ""
        }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-16">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"
      ></div>
      <p class="text-gray-600">Loading classes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button
        @click="loadLessons"
        class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
      >
        Retry
      </button>
    </div>

    <!-- Classes Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="lesson in filteredLessons"
        :key="lesson.id"
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer fade-in"
        @click="goToLesson(lesson.id)"
      >
        <!-- Class Image -->
        <div class="relative h-48 bg-gray-200 overflow-hidden">
          <img
            :src="lesson.image"
            :alt="lesson.title"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div
            class="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-semibold"
          >
            {{ lesson.category }}
          </div>
          <div
            v-if="lesson.featured"
            class="absolute top-2 left-2 bg-yellow-400 text-gray-900 text-xs px-3 py-1 rounded-full font-bold"
          >
            ⭐ Featured
          </div>
        </div>

        <!-- Class Info -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {{ lesson.title }}
          </h3>

          <!-- Teacher Info -->
          <div class="flex items-center gap-2 mb-3">
            <img
              :src="lesson.teacherAvatar"
              :alt="lesson.teacher"
              class="w-8 h-8 rounded-full object-cover border-2 border-indigo-200"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-700 truncate">
                {{ lesson.teacher }}
              </p>
            </div>
          </div>

          <!-- Rating -->
          <div class="flex items-center mb-3">
            <div class="flex items-center">
              <svg
                v-for="i in 5"
                :key="i"
                class="w-4 h-4"
                :class="
                  i <= Math.floor(lesson.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                "
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
            </div>
            <span class="ml-2 text-sm text-gray-600"
              >({{ lesson.reviews }})</span
            >
          </div>

          <!-- Class Details -->
          <div class="space-y-1 mb-3 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span class="font-medium">{{ lesson.subject || "General" }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {{ lesson.location || "TBA" }}
            </div>
            <div class="flex items-center gap-2">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ lesson.duration }} • {{ lesson.schedule }}
            </div>
            <div class="flex items-center gap-2">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Ages {{ lesson.ageGroup }}
            </div>
          </div>

          <!-- Price, Spaces, and Enroll -->
          <div class="flex flex-col gap-2 pt-3 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold text-indigo-600"
                  >${{ lesson.price }}</span
                >
                <span class="text-gray-500 text-sm"
                  >/{{ lesson.priceUnit }}</span
                >
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-700">
                  <span
                    v-if="lesson.spacesAvailable > 0"
                    class="text-green-600"
                  >
                    {{ lesson.spacesAvailable }} spaces left
                  </span>
                  <span v-else class="text-red-600">Full</span>
                </div>
              </div>
            </div>
            <button
              @click.stop="addToCart(lesson)"
              :disabled="lesson.spacesAvailable <= 0"
              :class="[
                'w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1',
                lesson.spacesAvailable > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              ]"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              <span>{{
                lesson.spacesAvailable > 0
                  ? "Enroll"
                  : "Full - No Spaces Available"
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredLessons.length === 0" class="text-center py-16">
      <svg
        class="w-24 h-24 mx-auto text-gray-300 mb-4"
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
      <h3 class="text-xl font-semibold text-gray-700 mb-2">No classes found</h3>
      <p class="text-gray-500">Try selecting a different category</p>
    </div>

    <!-- Why Choose Us Section -->
    <div class="mt-20 mb-12">
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
        Why Choose Our After School Programs?
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div
            class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Expert Teachers
          </h3>
          <p class="text-gray-600">
            All our instructors are certified professionals with years of
            experience in their field
          </p>
        </div>
        <div class="text-center">
          <div
            class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Flexible Schedule
          </h3>
          <p class="text-gray-600">
            Classes available throughout the week to fit your family's busy
            schedule
          </p>
        </div>
        <div class="text-center">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Small Class Sizes
          </h3>
          <p class="text-gray-600">
            Limited enrollment ensures personalized attention for every student
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "../store";
import apiService from "../services/api.js";

const router = useRouter();
const route = useRoute();
const selectedCategory = ref("all");
const classesSection = ref(null);
const lessons = ref([]);
const isLoading = ref(true);
const error = ref(null);
const sortBy = ref(route.query.sortBy || "createdAt");
const sortOrder = ref(route.query.sortOrder || "desc");

// Transform API lesson data to match frontend format
const transformLesson = (lesson) => {
  const maxStudents = lesson.max_students || 20;
  const studentsEnrolled = lesson.students_enrolled || 0;
  const spacesAvailable = Math.max(0, maxStudents - studentsEnrolled);

  return {
    id: lesson.id,
    title: lesson.title,
    subject: lesson.subject || "General",
    location: lesson.location || "TBA",
    category: lesson.category_name || "Uncategorized",
    teacher: lesson.teacher_name || "Unknown Teacher",
    teacherTitle: lesson.teacher_title || "",
    teacherAvatar: lesson.teacher_avatar || "https://i.pravatar.cc/150?img=1",
    price: lesson.price,
    priceUnit: lesson.price_unit,
    rating: lesson.rating || 0,
    reviews: lesson.reviews || 0,
    duration: lesson.duration,
    schedule: lesson.schedule,
    ageGroup: lesson.age_group,
    studentsEnrolled: studentsEnrolled,
    maxStudents: maxStudents,
    spacesAvailable: spacesAvailable,
    description: lesson.description,
    image:
      lesson.image ||
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
    features: lesson.features || [],
    featured: lesson.featured || false,
    available: lesson.available !== false,
  };
};

const filteredLessons = computed(() => {
  // Since search and category filtering are done on the backend,
  // we just return the lessons from API
  return lessons.value;
});

const loadLessons = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // Build query parameters
    const params = {
      available: true,
    };

    // Add category filter if not "all"
    if (selectedCategory.value && selectedCategory.value !== "all") {
      params.category = selectedCategory.value;
    }

    // Add search query if present
    if (route.query.search) {
      params.search = route.query.search;
    }

    // Add sort parameters
    params.sortBy = sortBy.value || route.query.sortBy || "createdAt";
    params.sortOrder = sortOrder.value || route.query.sortOrder || "desc";

    const response = await apiService.getLessons(params);
    if (response.success && response.data && response.data.lessons) {
      lessons.value = response.data.lessons.map(transformLesson);
    } else {
      lessons.value = [];
    }
  } catch (err) {
    console.error("Error loading lessons:", err);
    error.value = "Failed to load lessons. Please try again later.";
    lessons.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleSortChange = () => {
  const query = { ...route.query };
  query.sortBy = sortBy.value;
  query.sortOrder = sortOrder.value;
  // Remove page when sorting changes
  delete query.page;
  router.push({ path: "/", query });
};

const setSortOrder = (order) => {
  sortOrder.value = order;
  handleSortChange();
};

const goToLesson = (id) => {
  router.push(`/lesson/${id}`);
};

const clearSearch = () => {
  const query = { ...route.query };
  delete query.search;
  router.push({ path: "/", query });
};

const addToCart = async (lesson) => {
  // Check if spaces are available
  if (lesson.spacesAvailable <= 0) {
    alert("Sorry, this class is full. No spaces available.");
    return;
  }

  try {
    // Always save to localStorage first
    store.addToLocalCart(lesson.id, 1);

    // If logged in, sync with backend API
    if (store.isLoggedIn) {
      try {
        await apiService.addToCart(lesson.id, 1);
        // Refresh cart count from API
        await store.refreshCartCount();
      } catch (apiErr) {
        console.error("Error syncing cart with API:", apiErr);
        // Continue anyway - localStorage already saved
      }
    }

    alert("Class added to cart! Continue shopping or checkout to enroll.");
  } catch (err) {
    console.error("Error adding to cart:", err);
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Failed to add to cart. Please try again.";
    alert(errorMessage);
  }
};

const scrollToClasses = () => {
  classesSection.value?.scrollIntoView({ behavior: "smooth" });
};

// Watch for route query changes (category, search, sortBy, sortOrder)
watch(
  () => [
    route.query.category,
    route.query.search,
    route.query.sortBy,
    route.query.sortOrder,
  ],
  async () => {
    // Update selected category from route
    if (route.query.category && route.query.category !== "all") {
      selectedCategory.value = route.query.category;
    } else if (!route.query.category) {
      selectedCategory.value = "all";
    }

    // Update sortBy from route
    if (route.query.sortBy) {
      sortBy.value = route.query.sortBy;
    } else {
      sortBy.value = "createdAt";
    }

    // Update sortOrder from route
    if (route.query.sortOrder) {
      sortOrder.value = route.query.sortOrder;
    } else {
      sortOrder.value = "desc";
    }

    // Reload lessons when query changes
    await loadLessons();
  },
  { immediate: false }
);

onMounted(async () => {
  // Check if there's a category query parameter
  if (route.query.category && route.query.category !== "all") {
    selectedCategory.value = route.query.category;
  }

  // Check if there's a sortBy query parameter
  if (route.query.sortBy) {
    sortBy.value = route.query.sortBy;
  }

  // Check if there's a sortOrder query parameter
  if (route.query.sortOrder) {
    sortOrder.value = route.query.sortOrder;
  }

  // Load lessons from API
  await loadLessons();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
