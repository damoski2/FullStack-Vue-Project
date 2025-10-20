<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Complete Enrollment</h1>

    <!-- Redirect if cart is empty -->
    <div v-if="store.cart.length === 0" class="text-center py-16">
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
              v-for="item in store.cart"
              :key="item.id"
              class="flex items-center space-x-3"
            >
              <div
                class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0"
              >
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ item.title }}
                </p>
                <p class="text-xs text-gray-500">{{ item.teacher }}</p>
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
            :disabled="!isFormValid"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mb-3"
          >
            Complete Enrollment
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import store from "../store";

const router = useRouter();

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

const subtotal = computed(() => store.getCartTotal());
const tax = computed(() => subtotal.value * 0.1);
const total = computed(() => subtotal.value + tax.value);

const isFormValid = computed(() => {
  return (
    form.value.firstName &&
    form.value.lastName &&
    form.value.email &&
    form.value.phone &&
    form.value.studentFirstName &&
    form.value.studentLastName &&
    form.value.studentAge &&
    form.value.gradeLevel &&
    form.value.address &&
    form.value.city &&
    form.value.state &&
    form.value.zip &&
    form.value.cardNumber &&
    form.value.expiry &&
    form.value.cvv
  );
});

const handleCompleteEnrollment = () => {
  if (isFormValid.value) {
    alert(
      `🎉 Enrollment successful!\n\n${form.value.studentFirstName} ${
        form.value.studentLastName
      } has been enrolled in ${store.cart.length} class${
        store.cart.length > 1 ? "es" : ""
      }!\n\nA confirmation email with class details and schedule has been sent to ${
        form.value.email
      }.\n\n(This is a demo - no real payment was processed)`
    );
    store.clearCart();
    router.push("/");
  }
};
</script>
