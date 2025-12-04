<template>
  <div v-if="lesson" class="container mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <nav class="mb-8 text-sm">
      <ol class="flex items-center space-x-2 text-gray-500">
        <li>
          <router-link to="/" class="hover:text-indigo-600">Home</router-link>
        </li>
        <li>/</li>
        <li>
          <span class="text-gray-400">{{ lesson.category }}</span>
        </li>
        <li>/</li>
        <li class="text-gray-800">{{ lesson.title }}</li>
      </ol>
    </nav>

    <!-- Lesson Detail -->
    <div class="grid md:grid-cols-2 gap-12 mb-16">
      <!-- Lesson Image -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <img
          :src="lesson.image"
          :alt="lesson.title"
          class="w-full h-96 md:h-[600px] object-cover"
        />
      </div>

      <!-- Lesson Info -->
      <div>
        <div class="mb-4">
          <span
            class="inline-block bg-indigo-100 text-indigo-600 text-sm font-medium px-3 py-1 rounded-full"
          >
            {{ lesson.category }}
          </span>
          <span
            v-if="lesson.featured"
            class="ml-2 inline-block bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full"
          >
            ⭐ Featured
          </span>
        </div>

        <h1 class="text-4xl font-bold text-gray-900 mb-6">
          {{ lesson.title }}
        </h1>

        <!-- Teacher Info -->
        <div class="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <img
            :src="lesson.teacherAvatar"
            :alt="lesson.teacher"
            class="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
          />
          <div>
            <p class="text-lg font-semibold text-gray-900">
              {{ lesson.teacher }}
            </p>
            <p class="text-sm text-gray-600">{{ lesson.teacherTitle }}</p>
          </div>
        </div>

        <!-- Rating -->
        <div class="flex items-center mb-6">
          <div class="flex items-center">
            <svg
              v-for="i in 5"
              :key="i"
              class="w-5 h-5"
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
          <span class="ml-2 text-gray-600 font-medium"
            >{{ lesson.rating }} ({{ lesson.reviews }} reviews)</span
          >
          <span class="ml-4 text-gray-500"
            >• {{ lesson.studentsEnrolled }} students enrolled</span
          >
        </div>

        <!-- Price -->
        <div class="mb-8 p-6 bg-indigo-50 rounded-xl">
          <div class="flex items-baseline gap-2 mb-2">
            <span class="text-5xl font-bold text-indigo-600"
              >${{ lesson.price }}</span
            >
            <span class="text-gray-600 text-lg">/ {{ lesson.priceUnit }}</span>
          </div>
          <span
            v-if="lesson.available"
            class="inline-block bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full"
          >
            Available Now
          </span>
        </div>

        <!-- Class Details -->
        <div class="mb-8 grid grid-cols-2 gap-4">
          <div
            class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200"
          >
            <svg
              class="w-6 h-6 text-indigo-600"
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
            <div>
              <p class="text-sm text-gray-500">Subject</p>
              <p class="font-semibold text-gray-900">{{ lesson.subject }}</p>
            </div>
          </div>
          <div
            class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200"
          >
            <svg
              class="w-6 h-6 text-indigo-600"
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
            <div>
              <p class="text-sm text-gray-500">Location</p>
              <p class="font-semibold text-gray-900">{{ lesson.location }}</p>
            </div>
          </div>
          <div
            class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200"
          >
            <svg
              class="w-6 h-6 text-indigo-600"
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
            <div>
              <p class="text-sm text-gray-500">Duration</p>
              <p class="font-semibold text-gray-900">{{ lesson.duration }}</p>
            </div>
          </div>
          <div
            class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200"
          >
            <svg
              class="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p class="text-sm text-gray-500">Schedule</p>
              <p class="font-semibold text-gray-900">{{ lesson.schedule }}</p>
            </div>
          </div>
          <div
            class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200"
          >
            <svg
              class="w-6 h-6 text-indigo-600"
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
            <div>
              <p class="text-sm text-gray-500">Age Group</p>
              <p class="font-semibold text-gray-900">
                {{ lesson.ageGroup }} years
              </p>
            </div>
          </div>
          <div
            class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200"
          >
            <svg
              class="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <div>
              <p class="text-sm text-gray-500">Spaces Available</p>
              <p
                class="font-semibold text-gray-900"
                :class="
                  lesson.spacesAvailable > 0 ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ lesson.spacesAvailable }} / {{ lesson.maxStudents }}
              </p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            About This Class
          </h2>
          <p class="text-gray-600 leading-relaxed">{{ lesson.description }}</p>
        </div>

        <!-- Features/What You'll Learn -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            What You'll Learn
          </h2>
          <ul class="space-y-3">
            <li
              v-for="(feature, index) in lesson.features"
              :key="index"
              class="flex items-start"
            >
              <svg
                class="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span class="text-gray-700 text-lg">{{ feature }}</span>
            </li>
          </ul>
        </div>

        <!-- Quantity and Enroll Button -->
        <div class="flex flex-col sm:flex-row gap-4">
          <div
            class="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden"
            :class="lesson.spacesAvailable <= 0 ? 'opacity-50' : ''"
          >
            <button
              @click="quantity > 1 && quantity--"
              :disabled="lesson.spacesAvailable <= 0"
              class="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
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
                  d="M20 12H4"
                ></path>
              </svg>
            </button>
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              :max="lesson.spacesAvailable"
              :disabled="lesson.spacesAvailable <= 0"
              class="w-20 text-center py-3 focus:outline-none font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              @click="quantity < lesson.spacesAvailable && quantity++"
              :disabled="
                lesson.spacesAvailable <= 0 ||
                quantity >= lesson.spacesAvailable
              "
              class="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
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
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
            </button>
          </div>

          <button
            @click="handleEnroll"
            :disabled="lesson.spacesAvailable <= 0"
            :class="[
              'flex-1 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 shadow-lg',
              lesson.spacesAvailable > 0
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span>{{
              lesson.spacesAvailable > 0
                ? "Enroll Now"
                : "Full - No Spaces Available"
            }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Related Classes -->
    <div class="mt-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Similar Classes</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="relatedLesson in relatedLessons"
          :key="relatedLesson.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          @click="goToLesson(relatedLesson.id)"
        >
          <div class="h-48 bg-gray-200 overflow-hidden">
            <img
              :src="relatedLesson.image"
              :alt="relatedLesson.title"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">
              {{ relatedLesson.title }}
            </h3>
            <p class="text-sm text-gray-600 mb-2">
              {{ relatedLesson.teacher }}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-xl font-bold text-indigo-600"
                >${{ relatedLesson.price }}</span
              >
              <span class="text-sm text-gray-500"
                >/{{ relatedLesson.priceUnit }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="isLoading" class="container mx-auto px-4 py-16 text-center">
    <div
      class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"
    ></div>
    <p class="text-gray-600">Loading class details...</p>
  </div>

  <!-- Error/Not Found State -->
  <div v-else class="container mx-auto px-4 py-16 text-center">
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
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Class Not Found</h2>
    <p v-if="error" class="text-gray-500 mb-4">{{ error }}</p>
    <router-link
      to="/"
      class="text-indigo-600 hover:text-indigo-700 font-medium"
      >Back to Home</router-link
    >
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "../store";
import apiService from "../services/api.js";

const route = useRoute();
const router = useRouter();
const quantity = ref(1);
const lesson = ref(null);
const relatedLessons = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Transform API lesson data to match frontend format
const transformLesson = (apiLesson) => {
  const maxStudents = apiLesson.max_students || 20;
  const studentsEnrolled = apiLesson.students_enrolled || 0;
  const spacesAvailable = Math.max(0, maxStudents - studentsEnrolled);

  return {
    id: apiLesson.id,
    title: apiLesson.title,
    subject: apiLesson.subject || "General",
    location: apiLesson.location || "TBA",
    category: apiLesson.category_name || "Uncategorized",
    teacher: apiLesson.teacher_name || "Unknown Teacher",
    teacherTitle: apiLesson.teacher_title || "",
    teacherAvatar:
      apiLesson.teacher_avatar || "https://i.pravatar.cc/150?img=1",
    price: apiLesson.price,
    priceUnit: apiLesson.price_unit,
    rating: apiLesson.rating || 0,
    reviews: apiLesson.reviews || 0,
    duration: apiLesson.duration,
    schedule: apiLesson.schedule,
    ageGroup: apiLesson.age_group,
    studentsEnrolled: studentsEnrolled,
    maxStudents: maxStudents,
    spacesAvailable: spacesAvailable,
    description: apiLesson.description,
    image:
      apiLesson.image ||
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
    features: apiLesson.features || [],
    featured: apiLesson.featured || false,
    available: apiLesson.available !== false,
  };
};

const loadLesson = async (lessonId) => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await apiService.getLesson(lessonId);

    if (response.success && response.data && response.data.lesson) {
      lesson.value = transformLesson(response.data.lesson);

      // Load related lessons (same category)
      await loadRelatedLessons(lesson.value.category, lessonId);
    } else {
      error.value = "Lesson not found";
      lesson.value = null;
    }
  } catch (err) {
    console.error("Error loading lesson:", err);
    error.value = err.message || "Failed to load lesson";
    lesson.value = null;
  } finally {
    isLoading.value = false;
  }
};

const loadRelatedLessons = async (categoryName, excludeLessonId) => {
  try {
    if (!categoryName) return;

    const response = await apiService.getLessons({
      category: categoryName,
      available: true,
    });

    if (response.success && response.data && response.data.lessons) {
      // Filter out current lesson and limit to 4
      relatedLessons.value = response.data.lessons
        .filter((l) => l.id !== excludeLessonId)
        .slice(0, 4)
        .map(transformLesson);
    }
  } catch (err) {
    console.error("Error loading related lessons:", err);
    relatedLessons.value = [];
  }
};

const handleEnroll = async () => {
  if (!lesson.value) return;

  // Check if spaces are available
  if (lesson.value.spacesAvailable <= 0) {
    alert("Sorry, this class is full. No spaces available.");
    return;
  }

  // Check if quantity exceeds available spaces
  if (quantity.value > lesson.value.spacesAvailable) {
    alert(
      `Only ${lesson.value.spacesAvailable} space(s) available. Please adjust quantity.`
    );
    quantity.value = lesson.value.spacesAvailable;
    return;
  }

  try {
    // Always save to localStorage first
    store.addToLocalCart(lesson.value.id, quantity.value);

    // If logged in, sync with backend API
    if (store.isLoggedIn) {
      try {
        await apiService.addToCart(lesson.value.id, quantity.value);
        // Refresh cart count from API
        await store.refreshCartCount();
      } catch (apiErr) {
        console.error("Error syncing cart with API:", apiErr);
        // Continue anyway - localStorage already saved
      }
    }

    alert(`${quantity.value} enrollment(s) added to cart!`);
  } catch (err) {
    console.error("Error adding to cart:", err);
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Failed to add to cart. Please try again.";
    alert(errorMessage);
  }
};

const goToLesson = (id) => {
  router.push(`/lesson/${id}`);
  quantity.value = 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Watch for route changes
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      quantity.value = 1;
      loadLesson(newId);
    }
  },
  { immediate: true }
);

// Load lesson on mount
onMounted(() => {
  if (route.params.id) {
    loadLesson(route.params.id);
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
</style>
