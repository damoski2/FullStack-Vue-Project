import { reactive } from 'vue'

// Sample product data
export const products = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    rating: 4.5,
    reviews: 128,
    description: 'High-quality wireless headphones with active noise cancellation and premium sound quality.',
    features: ['Active Noise Cancellation', '30-hour battery life', 'Premium sound quality', 'Comfortable fit'],
    inStock: true
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 399.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    rating: 4.8,
    reviews: 256,
    description: 'Advanced smartwatch with health tracking, GPS, and stunning display.',
    features: ['Health tracking', 'GPS navigation', 'Water resistant', 'Always-on display'],
    inStock: true
  },
  {
    id: 3,
    name: 'Designer Sunglasses',
    price: 189.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
    rating: 4.3,
    reviews: 89,
    description: 'Stylish designer sunglasses with UV protection and premium frames.',
    features: ['UV protection', 'Polarized lenses', 'Premium materials', 'Designer style'],
    inStock: true
  },
  {
    id: 4,
    name: 'Leather Backpack',
    price: 149.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    rating: 4.6,
    reviews: 173,
    description: 'Premium leather backpack with laptop compartment and multiple pockets.',
    features: ['Genuine leather', 'Laptop compartment', 'Multiple pockets', 'Durable construction'],
    inStock: true
  },
  {
    id: 5,
    name: 'Minimalist Sneakers',
    price: 129.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&q=80',
    rating: 4.7,
    reviews: 312,
    description: 'Comfortable minimalist sneakers perfect for everyday wear.',
    features: ['Comfortable fit', 'Minimalist design', 'Breathable material', 'Versatile style'],
    inStock: true
  },
  {
    id: 6,
    name: 'Wireless Earbuds',
    price: 159.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    rating: 4.4,
    reviews: 441,
    description: 'True wireless earbuds with amazing sound quality and long battery life.',
    features: ['True wireless', 'Touch controls', '24-hour battery', 'Premium sound'],
    inStock: true
  },
  {
    id: 7,
    name: 'Professional Camera',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
    rating: 4.9,
    reviews: 187,
    description: 'Professional mirrorless camera with exceptional image quality.',
    features: ['High resolution', '4K video', 'Fast autofocus', 'Weather sealed'],
    inStock: true
  },
  {
    id: 8,
    name: 'Classic Wrist Watch',
    price: 249.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80',
    rating: 4.5,
    reviews: 93,
    description: 'Elegant classic watch with automatic movement and sapphire crystal.',
    features: ['Automatic movement', 'Sapphire crystal', 'Water resistant', 'Classic design'],
    inStock: true
  }
]

// Store state
export const store = reactive({
  cart: [],
  user: null,
  isLoggedIn: false,
  
  // Cart methods
  addToCart(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      this.cart.push({
        ...product,
        quantity
      })
    }
    
    this.saveCart()
  },
  
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId)
    this.saveCart()
  },
  
  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        this.removeFromCart(productId)
      }
    }
    this.saveCart()
  },
  
  clearCart() {
    this.cart = []
    this.saveCart()
  },
  
  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  },
  
  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0)
  },
  
  // User methods
  login(email, password) {
    // Simulate login
    this.user = {
      name: email.split('@')[0],
      email: email
    }
    this.isLoggedIn = true
    localStorage.setItem('user', JSON.stringify(this.user))
  },
  
  logout() {
    this.user = null
    this.isLoggedIn = false
    localStorage.removeItem('user')
  },
  
  register(name, email, password) {
    // Simulate registration
    this.user = {
      name: name,
      email: email
    }
    this.isLoggedIn = true
    localStorage.setItem('user', JSON.stringify(this.user))
  },
  
  // Persistence
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart))
  },
  
  loadCart() {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      this.cart = JSON.parse(savedCart)
    }
  },
  
  loadUser() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      this.user = JSON.parse(savedUser)
      this.isLoggedIn = true
    }
  },
  
  init() {
    this.loadCart()
    this.loadUser()
  }
})

// Initialize store
store.init()

export default store

