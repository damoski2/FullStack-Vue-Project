<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">My Enrollments</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-16">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"
      ></div>
      <p class="text-gray-600">Loading cart...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <div
        class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto"
      >
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadCart"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Cart Items -->
    <div v-else-if="cartItems.length > 0" class="grid lg:grid-cols-3 gap-8">
      <!-- Cart Items List -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-6"
        >
          <!-- Class Image -->
          <div
            class="w-full sm:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
            @click="goToLesson(item.lesson_id)"
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
                  @click="goToLesson(item.lesson_id)"
                >
                  {{ item.title }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ item.category_name || "Uncategorized" }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <img
                    :src="
                      item.teacher_avatar || 'https://i.pravatar.cc/150?img=1'
                    "
                    :alt="item.teacher_name"
                    class="w-6 h-6 rounded-full"
                  />
                  <p class="text-sm text-gray-600">
                    {{ item.teacher_name || "Unknown Teacher" }}
                  </p>
                </div>
              </div>
              <button
                @click="removeItem(item.lesson_id)"
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
                Ages {{ item.age_group }}
              </div>
            </div>

            <div class="flex items-center justify-between mt-4">
              <!-- Quantity Controls -->
              <div
                class="flex items-center border border-gray-300 rounded-lg overflow-hidden"
              >
                <button
                  @click="updateQuantity(item.lesson_id, item.quantity - 1)"
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
                  @click="updateQuantity(item.lesson_id, item.quantity + 1)"
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
                  {{ item.quantity }} × ${{ item.price }}/{{ item.price_unit }}
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
                >Subtotal ({{ cartSummary.itemCount }} class{{
                  cartSummary.itemCount !== 1 ? "es" : ""
                }})</span
              >
              <span>${{ cartSummary.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Processing Fee</span>
              <span class="text-green-600">Free</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Tax (estimated)</span>
              <span>${{ cartSummary.tax.toFixed(2) }}</span>
            </div>
            <div class="border-t pt-4">
              <div class="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span class="text-indigo-600"
                  >${{ cartSummary.total.toFixed(2) }}</span
                >
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import store from "../store";
import apiService from "../services/api.js";

const router = useRouter();
const cartItems = ref([]);
const cartSummary = ref({
  subtotal: 0,
  tax: 0,
  total: 0,
  itemCount: 0,
});
const isLoading = ref(true);
const error = ref(null);

// Transform API cart item to match frontend format
const transformCartItem = (item) => {
  return {
    id: item.id,
    lesson_id: item.lesson_id,
    quantity: item.quantity,
    title: item.title,
    price: item.price,
    price_unit: item.price_unit,
    duration: item.duration,
    schedule: item.schedule,
    age_group: item.age_group,
    image:
      item.image ||
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
    category_name: item.category_name,
    teacher_name: item.teacher_name,
    teacher_avatar: item.teacher_avatar || "https://i.pravatar.cc/150?img=1",
    teacher_title: item.teacher_title,
  };
};

const loadCart = async () => {
  isLoading.value = true;
  error.value = null;

  // First, load from localStorage
  const localCartItems = store.loadCartItems();

  // If not logged in, use localStorage only
  if (!store.isLoggedIn) {
    if (localCartItems.length === 0) {
      cartItems.value = [];
      cartSummary.value = {
        subtotal: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
      };
      isLoading.value = false;
      return;
    }

    // Load lesson details for localStorage items
    try {
      const lessonPromises = localCartItems.map(async (item) => {
        try {
          const response = await apiService.getLesson(item.lesson_id);
          if (response.success && response.data && response.data.lesson) {
            const lesson = response.data.lesson;
            return {
              id: item.lesson_id,
              lesson_id: item.lesson_id,
              quantity: item.quantity,
              title: lesson.title,
              price: lesson.price,
              price_unit: lesson.price_unit,
              duration: lesson.duration,
              schedule: lesson.schedule,
              age_group: lesson.age_group,
              image:
                lesson.image ||
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
              category_name: lesson.category_name,
              teacher_name: lesson.teacher_name,
              teacher_avatar:
                lesson.teacher_avatar || "https://i.pravatar.cc/150?img=1",
              teacher_title: lesson.teacher_title,
            };
          }
        } catch (err) {
          console.error(`Error loading lesson ${item.lesson_id}:`, err);
          return null;
        }
      });

      const loadedItems = (await Promise.all(lessonPromises)).filter(Boolean);
      cartItems.value = loadedItems;

      // Calculate summary
      const subtotal = loadedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      const itemCount = loadedItems.reduce(
        (count, item) => count + item.quantity,
        0
      );

      cartSummary.value = {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        itemCount: itemCount,
      };
    } catch (err) {
      console.error("Error loading cart from localStorage:", err);
      cartItems.value = [];
      cartSummary.value = {
        subtotal: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
      };
    }
    isLoading.value = false;
    return;
  }

  // If logged in, try to load from API, fallback to localStorage
  try {
    const response = await apiService.getCart();
    if (response.success && response.data) {
      cartItems.value = response.data.items.map(transformCartItem);
      cartSummary.value = response.data.summary || {
        subtotal: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
      };
      // Sync localStorage with API data
      const apiItems = response.data.items.map((item) => ({
        lesson_id: item.lesson_id,
        quantity: item.quantity,
      }));
      store.saveCartItems(apiItems);
    } else {
      // Fallback to localStorage
      await loadCartFromLocalStorage();
    }
  } catch (err) {
    console.error("Error loading cart from API:", err);
    // Fallback to localStorage
    await loadCartFromLocalStorage();
  } finally {
    isLoading.value = false;
  }
};

const loadCartFromLocalStorage = async () => {
  const localCartItems = store.loadCartItems();

  if (localCartItems.length === 0) {
    cartItems.value = [];
    cartSummary.value = {
      subtotal: 0,
      tax: 0,
      total: 0,
      itemCount: 0,
    };
    return;
  }

  // Load lesson details for localStorage items
  try {
    const lessonPromises = localCartItems.map(async (item) => {
      try {
        const response = await apiService.getLesson(item.lesson_id);
        if (response.success && response.data && response.data.lesson) {
          const lesson = response.data.lesson;
          return {
            id: item.lesson_id,
            lesson_id: item.lesson_id,
            quantity: item.quantity,
            title: lesson.title,
            price: lesson.price,
            price_unit: lesson.price_unit,
            duration: lesson.duration,
            schedule: lesson.schedule,
            age_group: lesson.age_group,
            image:
              lesson.image ||
              "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
            category_name: lesson.category_name,
            teacher_name: lesson.teacher_name,
            teacher_avatar:
              lesson.teacher_avatar || "https://i.pravatar.cc/150?img=1",
            teacher_title: lesson.teacher_title,
          };
        }
      } catch (err) {
        console.error(`Error loading lesson ${item.lesson_id}:`, err);
        return null;
      }
    });

    const loadedItems = (await Promise.all(lessonPromises)).filter(Boolean);
    cartItems.value = loadedItems;

    // Calculate summary
    const subtotal = loadedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    const itemCount = loadedItems.reduce(
      (count, item) => count + item.quantity,
      0
    );

    cartSummary.value = {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      itemCount: itemCount,
    };
  } catch (err) {
    console.error("Error loading cart from localStorage:", err);
    cartItems.value = [];
    cartSummary.value = {
      subtotal: 0,
      tax: 0,
      total: 0,
      itemCount: 0,
    };
  }
};

const updateQuantity = async (lessonId, newQuantity) => {
  if (newQuantity <= 0) {
    removeItem(lessonId);
    return;
  }

  try {
    // Update localStorage first
    store.updateLocalCartQuantity(lessonId, newQuantity);

    // If logged in, sync with API
    if (store.isLoggedIn) {
      try {
        await apiService.updateCartItem(lessonId, newQuantity);
      } catch (apiErr) {
        console.error("Error syncing quantity with API:", apiErr);
        // Continue anyway - localStorage already updated
      }
    }

    await loadCart(); // Reload cart to get updated data
  } catch (err) {
    console.error("Error updating cart:", err);
    alert("Failed to update quantity. Please try again.");
  }
};

const removeItem = async (lessonId) => {
  if (!confirm("Are you sure you want to remove this class from your cart?")) {
    return;
  }

  try {
    // Remove from localStorage first
    store.removeFromLocalCart(lessonId);

    // If logged in, sync with API
    if (store.isLoggedIn) {
      try {
        await apiService.removeFromCart(lessonId);
      } catch (apiErr) {
        console.error("Error syncing removal with API:", apiErr);
        // Continue anyway - localStorage already updated
      }
    }

    await loadCart(); // Reload cart after removal
  } catch (err) {
    console.error("Error removing from cart:", err);
    alert("Failed to remove item. Please try again.");
  }
};

const goToLesson = (id) => {
  router.push(`/lesson/${id}`);
};

const goToCheckout = () => {
  if (cartItems.value.length === 0) {
    alert("Your cart is empty. Add some classes first!");
    return;
  }
  router.push("/checkout");
};

onMounted(() => {
  // Check if user is logged in
  const token = localStorage.getItem("token");
  const user =
    store.user ||
    (localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null);

  if (!token || !user) {
    // User is not logged in, redirect to login
    router.push("/login");
    return;
  }

  // Ensure user data is loaded
  if (!store.isLoggedIn && token) {
    store.loadUser();
  }

  loadCart();
});
</script>
