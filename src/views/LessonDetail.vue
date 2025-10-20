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
              <p class="text-sm text-gray-500">Class Size</p>
              <p class="font-semibold text-gray-900">Small Group</p>
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
          >
            <button
              @click="quantity > 1 && quantity--"
              class="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
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
              class="w-20 text-center py-3 focus:outline-none font-semibold"
            />
            <button
              @click="quantity++"
              class="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
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
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 shadow-lg"
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
            <span>Enroll Now</span>
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

  <!-- Not Found -->
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
    <router-link
      to="/"
      class="text-indigo-600 hover:text-indigo-700 font-medium"
      >Back to Home</router-link
    >
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { lessons } from "../store";
import store from "../store";

const route = useRoute();
const router = useRouter();
const quantity = ref(1);

const lesson = computed(() => {
  const id = parseInt(route.params.id);
  return lessons.find((l) => l.id === id);
});

const relatedLessons = computed(() => {
  if (!lesson.value) return [];
  return lessons
    .filter(
      (l) => l.category === lesson.value.category && l.id !== lesson.value.id
    )
    .slice(0, 4);
});

const handleEnroll = () => {
  if (lesson.value) {
    store.addToCart(lesson.value, quantity.value);
    alert(`${quantity.value} enrollment(s) added to cart!`);
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
  () => {
    quantity.value = 1;
  }
);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
