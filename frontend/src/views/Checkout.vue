<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Complete Enrollment</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-16">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"
      ></div>
      <p class="text-gray-600">Loading checkout...</p>
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

    <!-- Redirect if cart is empty -->
    <div v-else-if="cartItems.length === 0" class="text-center py-16">
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
        Your cart is empty
      </h2>
      <router-link
        to="/"
        class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
      >
        Browse Classes
      </router-link>
    </div>

    <!-- Checkout Form -->
    <div v-else class="grid lg:grid-cols-3 gap-8">
      <!-- Forms -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Contact Information -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">
            Parent/Guardian Information
          </h2>
          <div class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >First Name</label
                >
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Last Name</label
                >
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Email Address</label
              >
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Phone Number</label
              >
              <input
                v-model="form.phone"
                type="tel"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        <!-- Student Information -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">
            Student Information
          </h2>
          <div class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Student First Name</label
                >
                <input
                  v-model="form.studentFirstName"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Student's first name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Student Last Name</label
                >
                <input
                  v-model="form.studentLastName"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Student's last name"
                />
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Age</label
                >
                <input
                  v-model="form.studentAge"
                  type="number"
                  required
                  min="5"
                  max="18"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="10"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Grade Level</label
                >
                <input
                  v-model="form.gradeLevel"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="5th Grade"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Special Notes or Requirements (Optional)</label
              >
              <textarea
                v-model="form.specialNotes"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Any allergies, special requirements, or additional information..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Address</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Street Address</label
              >
              <input
                v-model="form.address"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="123 Main St"
              />
            </div>

            <div class="grid sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >City</label
                >
                <input
                  v-model="form.city"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >State</label
                >
                <input
                  v-model="form.state"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >ZIP Code</label
                >
                <input
                  v-model="form.zip"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">
            Payment Information
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Card Number</label
              >
              <input
                v-model="form.cardNumber"
                type="text"
                required
                maxlength="19"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Expiry Date</label
                >
                <input
                  v-model="form.expiry"
                  type="text"
                  required
                  placeholder="MM/YY"
                  maxlength="5"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >CVV</label
                >
                <input
                  v-model="form.cvv"
                  type="text"
                  required
                  maxlength="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="123"
                />
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

          <!-- Cart Items -->
          <div class="space-y-4 mb-6 max-h-64 overflow-y-auto">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex items-center space-x-3"
            >
              <div
                class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0"
              >
                <img
                  :src="
                    item.image ||
                    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80'
                  "
                  :alt="item.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ item.title }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ item.teacher_name || "Unknown Teacher" }}
                </p>
                <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
              <span class="text-sm font-semibold text-gray-900"
                >${{ (item.price * item.quantity).toFixed(2) }}</span
              >
            </div>
          </div>

          <div class="space-y-3 mb-6 border-t pt-4">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Processing Fee</span>
              <span class="text-green-600">Free</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="border-t pt-3">
              <div class="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span class="text-indigo-600">${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <button
            @click="handleCompleteEnrollment"
            :disabled="!isFormValid || isProcessing"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mb-3"
          >
            <span v-if="isProcessing">Processing...</span>
            <span v-else>Complete Enrollment</span>
          </button>

          <p class="text-xs text-gray-500 text-center">
            By completing this enrollment, you agree to our terms and conditions
          </p>
        </div>
      </div>
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
const isLoading = ref(true);
const isProcessing = ref(false);
const error = ref(null);

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  studentFirstName: "",
  studentLastName: "",
  studentAge: "",
  gradeLevel: "",
  specialNotes: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
});

const subtotal = computed(() => {
  return cartItems.value.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
});
const tax = computed(() => subtotal.value * 0.1);
const total = computed(() => subtotal.value + tax.value);

const loadCart = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await apiService.getCart();
    if (response.success && response.data && response.data.items) {
      cartItems.value = response.data.items;
    } else {
      error.value = "Failed to load cart items";
      cartItems.value = [];
    }
  } catch (err) {
    console.error("Error loading cart:", err);
    error.value = err.message || "Failed to load cart. Please try again.";
    cartItems.value = [];
  } finally {
    isLoading.value = false;
  }
};

const isFormValid = computed(() => {
  // Check if cart has items
  if (cartItems.value.length === 0) {
    return false;
  }

  // Check all required form fields (trimmed to handle whitespace-only values)
  // studentAge is a number input, so check if it exists and is not empty
  const studentAgeValid =
    form.value.studentAge && String(form.value.studentAge).trim() !== "";

  return (
    form.value.firstName?.trim() &&
    form.value.lastName?.trim() &&
    form.value.email?.trim() &&
    form.value.phone?.trim() &&
    form.value.studentFirstName?.trim() &&
    form.value.studentLastName?.trim() &&
    studentAgeValid &&
    form.value.gradeLevel?.trim() &&
    form.value.address?.trim() &&
    form.value.city?.trim() &&
    form.value.state?.trim() &&
    form.value.zip?.trim() &&
    form.value.cardNumber?.trim() &&
    form.value.expiry?.trim() &&
    form.value.cvv?.trim()
  );
});

const handleCompleteEnrollment = async () => {
  if (!isFormValid.value || isProcessing.value) {
    return;
  }

  isProcessing.value = true;
  error.value = null;

  try {
    // Prepare checkout data according to backend API format
    const checkoutData = {
      student_name: `${form.value.studentFirstName} ${form.value.studentLastName}`,
      phone_number: form.value.phone,
      student_age: parseInt(form.value.studentAge),
      student_grade: form.value.gradeLevel || "",
      special_notes: form.value.specialNotes || "",
      payment_method: "card", // Default to card
      card_number: form.value.cardNumber.replace(/\s/g, ""), // Remove spaces
      card_expiry: form.value.expiry,
      card_cvv: form.value.cvv,
      cardholder_name: `${form.value.firstName} ${form.value.lastName}`,
    };

    // Call the checkout API
    const response = await apiService.checkout(checkoutData);

    if (response.success) {
      // Clear cart from backend (already done by API, but clear local too)
      store.clearLocalCart();
      await store.refreshCartCount();

      // Show success message
      alert(
        `🎉 Enrollment successful!\n\n${form.value.studentFirstName} ${
          form.value.studentLastName
        } has been enrolled in ${response.data.enrollments.length} class${
          response.data.enrollments.length > 1 ? "es" : ""
        }!\n\nPayment ID: ${
          response.data.payment_id
        }\n\nA confirmation email with class details and schedule has been sent to ${
          form.value.email
        }.`
      );

      // Redirect to home
      router.push("/");
    } else {
      throw new Error(response.message || "Checkout failed");
    }
  } catch (err) {
    console.error("Checkout error:", err);
    error.value =
      err.response?.message ||
      err.message ||
      "Failed to complete enrollment. Please try again.";
    alert(error.value);
  } finally {
    isProcessing.value = false;
  }
};

// Redirect if not logged in
onMounted(async () => {
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
    await store.loadUser();
  }

  // Load cart items from API
  await loadCart();
});
</script>
