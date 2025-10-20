<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">My Enrollments</h1>

    <!-- Cart Items -->
    <div v-if="store.cart.length > 0" class="grid lg:grid-cols-3 gap-8">
      <!-- Cart Items List -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in store.cart"
          :key="item.id"
          class="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-6"
        >
          <!-- Class Image -->
          <div
            class="w-full sm:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
            @click="goToLesson(item.id)"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>

          <!-- Class Info -->
          <div class="flex-1">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 cursor-pointer hover:text-indigo-600"
                  @click="goToLesson(item.id)"
                >
                  {{ item.title }}
                </h3>
                <p class="text-sm text-gray-500">{{ item.category }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <img
                    :src="item.teacherAvatar"
                    :alt="item.teacher"
                    class="w-6 h-6 rounded-full"
                  />
                  <p class="text-sm text-gray-600">{{ item.teacher }}</p>
                </div>
              </div>
              <button
                @click="removeItem(item.id)"
                class="text-red-500 hover:text-red-700 transition-colors"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>

            <!-- Class Details -->
            <div class="text-sm text-gray-600 space-y-1 mb-3">
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
                {{ item.duration }} • {{ item.schedule }}
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
                Ages {{ item.ageGroup }}
              </div>
            </div>

            <div class="flex items-center justify-between mt-4">
              <!-- Quantity Controls -->
              <div
                class="flex items-center border border-gray-300 rounded-lg overflow-hidden"
              >
                <button
                  @click="updateQuantity(item.id, item.quantity - 1)"
                  class="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
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
                <span class="px-4 py-1 text-gray-900 font-medium">{{
                  item.quantity
                }}</span>
                <button
                  @click="updateQuantity(item.id, item.quantity + 1)"
                  class="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
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

              <!-- Price -->
              <div class="text-right">
                <span class="text-xl font-bold text-indigo-600"
                  >${{ (item.price * item.quantity).toFixed(2) }}</span
                >
                <p class="text-xs text-gray-500">
                  {{ item.quantity }} × ${{ item.price }}/{{ item.priceUnit }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-md p-6 sticky top-24">
          <h2 class="text-xl font-bold text-gray-900 mb-6">
            Enrollment Summary
          </h2>

          <div class="space-y-4 mb-6">
            <div class="flex justify-between text-gray-600">
              <span
                >Subtotal ({{ totalItems }} class{{
                  totalItems !== 1 ? "es" : ""
                }})</span
              >
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Processing Fee</span>
              <span class="text-green-600">Free</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Tax (estimated)</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="border-t pt-4">
              <div class="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span class="text-indigo-600">${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <button
            @click="goToCheckout"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors mb-3"
          >
            Proceed to Checkout
          </button>

          <router-link
            to="/"
            class="block text-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Continue Browsing
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center py-16">
      <svg
        class="w-32 h-32 mx-auto text-gray-300 mb-6"
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
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">
        No classes in your cart
      </h2>
      <p class="text-gray-500 mb-8">
        Explore our after-school programs and find the perfect class for your
        child!
      </p>
      <router-link
        to="/"
        class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
      >
        Browse Classes
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import store from "../store";

const router = useRouter();

const totalItems = computed(() => store.getCartCount());
const subtotal = computed(() => store.getCartTotal());
const tax = computed(() => subtotal.value * 0.1); // 10% tax
const total = computed(() => subtotal.value + tax.value);

const updateQuantity = (lessonId, newQuantity) => {
  if (newQuantity <= 0) {
    removeItem(lessonId);
  } else {
    store.updateQuantity(lessonId, newQuantity);
  }
};

const removeItem = (lessonId) => {
  if (confirm("Are you sure you want to remove this class from your cart?")) {
    store.removeFromCart(lessonId);
  }
};

const goToLesson = (id) => {
  router.push(`/lesson/${id}`);
};

const goToCheckout = () => {
  router.push("/checkout");
};
</script>
