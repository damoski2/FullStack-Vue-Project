import { reactive } from "vue";

// Sample lessons data - After school classes and activities
export const lessons = [
  {
    id: 1,
    title: "Piano Lessons for Beginners",
    category: "Music",
    teacher: "Sarah Johnson",
    teacherTitle: "Concert Pianist",
    teacherAvatar: "https://i.pravatar.cc/150?img=5",
    price: 45,
    priceUnit: "hour",
    rating: 4.9,
    reviews: 127,
    duration: "1 hour",
    schedule: "Mon & Wed, 4:00 PM",
    ageGroup: "8-16",
    studentsEnrolled: 34,
    description:
      "Learn piano from scratch with fun, engaging lessons tailored to your pace. Perfect for beginners who want to develop strong fundamentals.",
    image:
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&q=80",
    features: [
      "Individual attention",
      "Music theory basics",
      "Performance skills",
      "Practice materials included",
    ],
    featured: true,
    available: true,
  },
  {
    id: 2,
    title: "Advanced Math & Problem Solving",
    category: "Math",
    teacher: "Dr. Michael Chen",
    teacherTitle: "PhD Mathematics",
    teacherAvatar: "https://i.pravatar.cc/150?img=12",
    price: 55,
    priceUnit: "hour",
    rating: 4.8,
    reviews: 203,
    duration: "1.5 hours",
    schedule: "Tue & Thu, 5:00 PM",
    ageGroup: "11-16",
    studentsEnrolled: 56,
    description:
      "Boost your math skills with challenging problems and advanced concepts. Prepare for competitions and excel in school mathematics.",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80",
    features: [
      "Competition preparation",
      "Advanced problem solving",
      "Small group sessions",
      "Weekly homework support",
    ],
    featured: false,
    available: true,
  },
  {
    id: 3,
    title: "Creative Art & Drawing",
    category: "Art",
    teacher: "Emma Rodriguez",
    teacherTitle: "Professional Artist",
    teacherAvatar: "https://i.pravatar.cc/150?img=9",
    price: 40,
    priceUnit: "session",
    rating: 4.7,
    reviews: 89,
    duration: "2 hours",
    schedule: "Saturdays, 10:00 AM",
    ageGroup: "5-13",
    studentsEnrolled: 28,
    description:
      "Unleash your creativity with various art techniques including drawing, painting, and mixed media. All materials provided!",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
    features: [
      "All materials included",
      "Various art techniques",
      "Portfolio development",
      "Art history exploration",
    ],
    featured: true,
    available: true,
  },
  {
    id: 4,
    title: "Soccer Skills Academy",
    category: "Sports",
    teacher: "Coach David Martinez",
    teacherTitle: "UEFA Licensed Coach",
    teacherAvatar: "https://i.pravatar.cc/150?img=14",
    price: 35,
    priceUnit: "session",
    rating: 4.9,
    reviews: 156,
    duration: "1.5 hours",
    schedule: "Mon, Wed & Fri, 4:30 PM",
    ageGroup: "7-14",
    studentsEnrolled: 67,
    description:
      "Develop soccer skills, teamwork, and fitness in a fun and supportive environment. All skill levels welcome!",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&q=80",
    features: [
      "Professional coaching",
      "Team building activities",
      "Match preparation",
      "Fitness training",
    ],
    featured: false,
    available: true,
  },
  {
    id: 5,
    title: "Spanish for Kids",
    category: "Language",
    teacher: "Isabella Garcia",
    teacherTitle: "Native Speaker & Educator",
    teacherAvatar: "https://i.pravatar.cc/150?img=20",
    price: 38,
    priceUnit: "hour",
    rating: 4.8,
    reviews: 94,
    duration: "1 hour",
    schedule: "Tue & Thu, 4:00 PM",
    ageGroup: "5-12",
    studentsEnrolled: 42,
    description:
      "Learn Spanish through games, songs, and interactive activities. Build confidence in speaking and understanding Spanish!",
    image:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&q=80",
    features: [
      "Interactive learning",
      "Cultural activities",
      "Conversational practice",
      "Fun learning games",
    ],
    featured: false,
    available: true,
  },
  {
    id: 6,
    title: "Science Explorers Lab",
    category: "Science",
    teacher: "Dr. Amanda White",
    teacherTitle: "PhD Chemistry",
    teacherAvatar: "https://i.pravatar.cc/150?img=16",
    price: 50,
    priceUnit: "session",
    rating: 4.9,
    reviews: 178,
    duration: "2 hours",
    schedule: "Fridays, 4:00 PM",
    ageGroup: "8-14",
    studentsEnrolled: 51,
    description:
      "Hands-on science experiments exploring physics, chemistry, and biology. Spark curiosity and love for science!",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80",
    features: [
      "Hands-on experiments",
      "Safety equipment provided",
      "Science fair preparation",
      "Lab report writing",
    ],
    featured: true,
    available: true,
  },
  {
    id: 7,
    title: "Coding & Game Development",
    category: "Technology",
    teacher: "Alex Thompson",
    teacherTitle: "Software Engineer",
    teacherAvatar: "https://i.pravatar.cc/150?img=33",
    price: 60,
    priceUnit: "hour",
    rating: 5.0,
    reviews: 142,
    duration: "1.5 hours",
    schedule: "Wed & Sat, 3:00 PM",
    ageGroup: "10-17",
    studentsEnrolled: 73,
    description:
      "Learn to code and create your own games using Python and Scratch. Perfect for future programmers and game designers!",
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&q=80",
    features: [
      "Python & Scratch",
      "Game design fundamentals",
      "Portfolio projects",
      "Computer science concepts",
    ],
    featured: false,
    available: true,
  },
  {
    id: 8,
    title: "Ballet & Contemporary Dance",
    category: "Dance",
    teacher: "Sophia Anderson",
    teacherTitle: "Professional Dancer",
    teacherAvatar: "https://i.pravatar.cc/150?img=23",
    price: 42,
    priceUnit: "session",
    rating: 4.8,
    reviews: 116,
    duration: "1.5 hours",
    schedule: "Mon & Wed, 5:30 PM",
    ageGroup: "6-14",
    studentsEnrolled: 39,
    description:
      "Develop grace, strength, and expression through classical ballet and contemporary dance techniques.",
    image:
      "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=500&q=80",
    features: [
      "Classical technique",
      "Performance opportunities",
      "Flexibility training",
      "Recital preparation",
    ],
    featured: false,
    available: true,
  },
  {
    id: 9,
    title: "Guitar Masterclass",
    category: "Music",
    teacher: "Jake Morrison",
    teacherTitle: "Professional Guitarist",
    teacherAvatar: "https://i.pravatar.cc/150?img=52",
    price: 48,
    priceUnit: "hour",
    rating: 4.7,
    reviews: 98,
    duration: "1 hour",
    schedule: "Tue & Thu, 6:00 PM",
    ageGroup: "10-17",
    studentsEnrolled: 45,
    description:
      "Master the guitar with lessons in rock, blues, and classical styles. Learn chords, solos, and songwriting!",
    image:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80",
    features: [
      "Multiple music styles",
      "Songwriting basics",
      "Music reading",
      "Performance techniques",
    ],
    featured: false,
    available: true,
  },
  {
    id: 10,
    title: "Creative Writing Workshop",
    category: "Language",
    teacher: "Rachel Brooks",
    teacherTitle: "Published Author",
    teacherAvatar: "https://i.pravatar.cc/150?img=26",
    price: 44,
    priceUnit: "session",
    rating: 4.9,
    reviews: 87,
    duration: "2 hours",
    schedule: "Saturdays, 2:00 PM",
    ageGroup: "11-16",
    studentsEnrolled: 31,
    description:
      "Develop storytelling skills, creative expression, and writing techniques. Perfect for aspiring young authors!",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80",
    features: [
      "Story development",
      "Character building",
      "Publishing guidance",
      "Peer feedback sessions",
    ],
    featured: false,
    available: true,
  },
  {
    id: 11,
    title: "Robotics & Engineering",
    category: "Technology",
    teacher: "Dr. Kevin Park",
    teacherTitle: "Robotics Engineer",
    teacherAvatar: "https://i.pravatar.cc/150?img=60",
    price: 65,
    priceUnit: "session",
    rating: 5.0,
    reviews: 134,
    duration: "2 hours",
    schedule: "Thursdays, 4:00 PM",
    ageGroup: "12-17",
    studentsEnrolled: 48,
    description:
      "Build and program robots! Learn engineering principles, coding, and problem-solving with hands-on projects.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80",
    features: [
      "Robot building",
      "Programming basics",
      "Competition prep",
      "Engineering concepts",
    ],
    featured: true,
    available: true,
  },
  {
    id: 12,
    title: "Tennis Academy",
    category: "Sports",
    teacher: "Coach Maria Santos",
    teacherTitle: "Professional Tennis Coach",
    teacherAvatar: "https://i.pravatar.cc/150?img=47",
    price: 52,
    priceUnit: "hour",
    rating: 4.8,
    reviews: 121,
    duration: "1 hour",
    schedule: "Mon, Wed & Fri, 5:00 PM",
    ageGroup: "8-16",
    studentsEnrolled: 58,
    description:
      "Improve your tennis game with professional coaching. Learn technique, strategy, and sportsmanship!",
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&q=80",
    features: [
      "Professional coaching",
      "Match strategy",
      "Fitness conditioning",
      "Tournament preparation",
    ],
    featured: false,
    available: true,
  },
];

// Store state
export const store = reactive({
  cart: [],
  cartCount: 0,
  user: null,
  isLoggedIn: false,

  // Cart methods (now for lessons/classes)
  addToCart(lesson, quantity = 1) {
    const existingItem = this.cart.find((item) => item.id === lesson.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        ...lesson,
        quantity,
      });
    }

    this.saveCart();
  },

  removeFromCart(lessonId) {
    this.cart = this.cart.filter((item) => item.id !== lessonId);
    this.saveCart();
  },

  updateQuantity(lessonId, quantity) {
    const item = this.cart.find((item) => item.id !== lessonId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(lessonId);
      }
    }
    this.saveCart();
  },

  clearCart() {
    this.cart = [];
    this.cartCount = 0;
    this.saveCart();
  },

  getCartTotal() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  getCartCount() {
    return this.cartCount;
  },

  async refreshCartCount() {
    // Always load from localStorage first
    const localItems = this.loadCartItems();

    if (!this.isLoggedIn) {
      // Use localStorage count if not logged in
      this.cartCount = localItems.reduce(
        (count, item) => count + item.quantity,
        0
      );
      return;
    }

    // If logged in, sync with backend API
    try {
      const apiService = (await import("../services/api.js")).default;
      const response = await apiService.getCartCount();
      if (response.success && response.data) {
        this.cartCount = response.data.count || 0;
        // Update localStorage with backend count if different
        if (
          this.cartCount !==
          localItems.reduce((count, item) => count + item.quantity, 0)
        ) {
          // Backend is source of truth when logged in
        }
      } else {
        // Fallback to localStorage if API fails
        this.cartCount = localItems.reduce(
          (count, item) => count + item.quantity,
          0
        );
      }
    } catch (error) {
      console.error("Failed to refresh cart count:", error);
      // Fallback to localStorage if API fails
      this.cartCount = localItems.reduce(
        (count, item) => count + item.quantity,
        0
      );
    }
  },

  // User methods
  setUser(userData) {
    this.user = userData;
    this.isLoggedIn = true;
    localStorage.setItem("user", JSON.stringify(userData));
  },

  async logout() {
    try {
      // Call API logout if token exists
      const token = localStorage.getItem("token");
      if (token) {
        // Import apiService dynamically to avoid circular dependency
        const apiService = (await import("../services/api.js")).default;
        await apiService.logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.user = null;
      this.isLoggedIn = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  },

  // Persistence - Save cart items to localStorage
  saveCartItems(cartItems) {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      // Update cart count from localStorage
      this.cartCount = cartItems.reduce(
        (count, item) => count + item.quantity,
        0
      );
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  },

  // Load cart items from localStorage
  loadCartItems() {
    try {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        const items = JSON.parse(savedCart);
        this.cartCount = items.reduce(
          (count, item) => count + item.quantity,
          0
        );
        return items;
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
    return [];
  },

  // Add item to localStorage cart
  addToLocalCart(lessonId, quantity = 1) {
    const items = this.loadCartItems();
    const existingIndex = items.findIndex(
      (item) => item.lesson_id === lessonId
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        lesson_id: lessonId,
        quantity: quantity,
      });
    }

    this.saveCartItems(items);
  },

  // Remove item from localStorage cart
  removeFromLocalCart(lessonId) {
    const items = this.loadCartItems();
    const filtered = items.filter((item) => item.lesson_id !== lessonId);
    this.saveCartItems(filtered);
  },

  // Update quantity in localStorage cart
  updateLocalCartQuantity(lessonId, quantity) {
    if (quantity <= 0) {
      this.removeFromLocalCart(lessonId);
      return;
    }

    const items = this.loadCartItems();
    const existingIndex = items.findIndex(
      (item) => item.lesson_id === lessonId
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity = quantity;
      this.saveCartItems(items);
    }
  },

  // Clear localStorage cart
  clearLocalCart() {
    localStorage.removeItem("cartItems");
    this.cartCount = 0;
  },

  async loadUser() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Import apiService dynamically to avoid circular dependency
        const apiService = (await import("../services/api.js")).default;
        const response = await apiService.getCurrentUser();
        if (response.success && response.data.user) {
          this.user = response.data.user;
          this.isLoggedIn = true;
          localStorage.setItem("user", JSON.stringify(response.data.user));
          // Refresh cart count when user loads
          await this.refreshCartCount();
        } else {
          // Token might be invalid, clear it
          this.clearAuth();
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        // Token might be invalid, clear it
        this.clearAuth();
      }
    } else {
      // Try to load from localStorage as fallback
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        this.user = JSON.parse(savedUser);
        this.isLoggedIn = true;
        // Refresh cart count when user loads
        await this.refreshCartCount();
      }
    }
  },

  clearAuth() {
    this.user = null;
    this.isLoggedIn = false;
    this.cartCount = 0;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  init() {
    // Load cart count from localStorage on init
    this.loadCartItems();
    this.loadUser();
  },
});

// Initialize store
store.init();

export default store;
