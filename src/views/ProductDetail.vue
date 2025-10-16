<template>
  <div v-if="product" class="container mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <nav class="mb-8 text-sm">
      <ol class="flex items-center space-x-2 text-gray-500">
        <li><router-link to="/" class="hover:text-blue-600">Home</router-link></li>
        <li>/</li>
        <li><span class="text-gray-400">{{ product.category }}</span></li>
        <li>/</li>
        <li class="text-gray-800">{{ product.name }}</li>
      </ol>
    </nav>

    <!-- Product Detail -->
    <div class="grid md:grid-cols-2 gap-12 mb-16">
      <!-- Product Image -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <img 
          :src="product.image" 
          :alt="product.name"
          class="w-full h-96 md:h-[600px] object-cover"
        >
      </div>

      <!-- Product Info -->
      <div>
        <div class="mb-4">
          <span class="inline-block bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
            {{ product.category }}
          </span>
        </div>

        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>

        <!-- Rating -->
        <div class="flex items-center mb-6">
          <div class="flex items-center">
            <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <span class="ml-2 text-gray-600">{{ product.rating }} ({{ product.reviews }} reviews)</span>
        </div>

        <!-- Price -->
        <div class="mb-8">
          <span class="text-5xl font-bold text-blue-600">${{ product.price.toFixed(2) }}</span>
          <span v-if="product.inStock" class="ml-4 inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
            In Stock
          </span>
        </div>

        <!-- Description -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
          <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>
        </div>

        <!-- Features -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Key Features</h2>
          <ul class="space-y-2">
            <li v-for="(feature, index) in product.features" :key="index" class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-gray-700">{{ feature }}</span>
            </li>
          </ul>
        </div>

        <!-- Quantity and Add to Cart -->
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button 
              @click="quantity > 1 && quantity--"
              class="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <input 
              v-model.number="quantity"
              type="number"
              min="1"
              class="w-16 text-center py-3 focus:outline-none"
            >
            <button 
              @click="quantity++"
              class="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>

          <button 
            @click="handleAddToCart"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div class="mt-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="relatedProduct in relatedProducts" 
          :key="relatedProduct.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          @click="goToProduct(relatedProduct.id)"
        >
          <div class="h-48 bg-gray-200 overflow-hidden">
            <img 
              :src="relatedProduct.image" 
              :alt="relatedProduct.name"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            >
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">{{ relatedProduct.name }}</h3>
            <span class="text-xl font-bold text-blue-600">${{ relatedProduct.price.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Not Found -->
  <div v-else class="container mx-auto px-4 py-16 text-center">
    <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Product Not Found</h2>
    <router-link to="/" class="text-blue-600 hover:text-blue-700">Back to Home</router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { products } from '../store'
import store from '../store'

const route = useRoute()
const router = useRouter()
const quantity = ref(1)

const product = computed(() => {
  const id = parseInt(route.params.id)
  return products.find(p => p.id === id)
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  return products
    .filter(p => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 4)
})

const handleAddToCart = () => {
  if (product.value) {
    store.addToCart(product.value, quantity.value)
    alert(`${quantity.value} item(s) added to cart!`)
  }
}

const goToProduct = (id) => {
  router.push(`/product/${id}`)
  quantity.value = 1
}

// Watch for route changes
watch(() => route.params.id, () => {
  quantity.value = 1
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

