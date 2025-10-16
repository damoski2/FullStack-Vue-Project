<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

    <!-- Cart Items -->
    <div v-if="store.cart.length > 0" class="grid lg:grid-cols-3 gap-8">
      <!-- Cart Items List -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in store.cart"
          :key="item.id"
          class="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-6"
        >
          <!-- Product Image -->
          <div
            class="w-full sm:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
            @click="goToProduct(item.id)"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>

          <!-- Product Info -->
          <div class="flex-1">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                  @click="goToProduct(item.id)"
                >
                  {{ item.name }}
                </h3>
                <p class="text-sm text-gray-500">{{ item.category }}</p>
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
              <span class="text-xl font-bold text-blue-600"
                >${{ (item.price * item.quantity).toFixed(2) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-md p-6 sticky top-24">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

          <div class="space-y-4 mb-6">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal ({{ totalItems }} items)</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span class="text-green-600">Free</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Tax (estimated)</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="border-t pt-4">
              <div class="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span class="text-blue-600">${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <button
            @click="goToCheckout"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors mb-3"
          >
            Proceed to Checkout
          </button>

          <router-link
            to="/"
            class="block text-center text-blue-600 hover:text-blue-700 font-medium"
          >
            Continue Shopping
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
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        ></path>
      </svg>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">
        Your cart is empty
      </h2>
      <p class="text-gray-500 mb-8">Add some products to get started!</p>
      <router-link
        to="/"
        class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
      >
        Shop Now
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

const updateQuantity = (productId, newQuantity) => {
  if (newQuantity <= 0) {
    removeItem(productId);
  } else {
    store.updateQuantity(productId, newQuantity);
  }
};

const removeItem = (productId) => {
  if (confirm("Are you sure you want to remove this item?")) {
    store.removeFromCart(productId);
  }
};

const goToProduct = (id) => {
  router.push(`/product/${id}`);
};

const goToCheckout = () => {
  router.push("/checkout");
};
</script>
