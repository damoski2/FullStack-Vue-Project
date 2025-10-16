<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 mb-12 text-white">
      <div class="max-w-2xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Welcome to LuxeShop</h1>
        <p class="text-lg md:text-xl mb-6 text-blue-100">Discover premium products at unbeatable prices. Shop the latest in electronics and fashion.</p>
        <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Shop Now
        </button>
      </div>
    </div>

    <!-- Filter buttons -->
    <div class="flex flex-wrap gap-4 mb-8">
      <button 
        @click="selectedCategory = 'all'"
        :class="selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
        class="px-6 py-2 rounded-lg font-medium transition-colors border border-gray-200"
      >
        All Products
      </button>
      <button 
        @click="selectedCategory = 'Electronics'"
        :class="selectedCategory === 'Electronics' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
        class="px-6 py-2 rounded-lg font-medium transition-colors border border-gray-200"
      >
        Electronics
      </button>
      <button 
        @click="selectedCategory = 'Fashion'"
        :class="selectedCategory === 'Fashion' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
        class="px-6 py-2 rounded-lg font-medium transition-colors border border-gray-200"
      >
        Fashion
      </button>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer fade-in"
        @click="goToProduct(product.id)"
      >
        <!-- Product Image -->
        <div class="relative h-64 bg-gray-200 overflow-hidden">
          <img 
            :src="product.image" 
            :alt="product.name"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
          <div v-if="product.inStock" class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            In Stock
          </div>
        </div>

        <!-- Product Info -->
        <div class="p-4">
          <p class="text-sm text-gray-500 mb-1">{{ product.category }}</p>
          <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{{ product.name }}</h3>
          
          <!-- Rating -->
          <div class="flex items-center mb-3">
            <div class="flex items-center">
              <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <span class="ml-2 text-sm text-gray-600">({{ product.reviews }})</span>
          </div>

          <!-- Price and Add to Cart -->
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-blue-600">${{ product.price.toFixed(2) }}</span>
            <button 
              @click.stop="addToCart(product)"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredProducts.length === 0" class="text-center py-16">
      <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
      </svg>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
      <p class="text-gray-500">Try adjusting your filters</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { products } from '../store'
import store from '../store'

const router = useRouter()
const route = useRoute()
const selectedCategory = ref('all')

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return products
  }
  return products.filter(p => p.category === selectedCategory.value)
})

const goToProduct = (id) => {
  router.push(`/product/${id}`)
}

const addToCart = (product) => {
  store.addToCart(product)
  // Show notification (you could add a toast notification here)
  alert('Product added to cart!')
}

onMounted(() => {
  // Check if there's a category query parameter
  if (route.query.category && route.query.category !== 'all') {
    selectedCategory.value = route.query.category
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

