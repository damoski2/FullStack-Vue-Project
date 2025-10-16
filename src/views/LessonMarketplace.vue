<template>
  <div class="lesson-marketplace bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          After School Lesson Marketplace
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing lessons for your child. From music to math, we've got it all!
        </p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <!-- Search Bar -->
        <div class="mb-6">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for lessons, teachers, or subjects..."
              class="w-full px-6 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-lg"
              @input="handleSearch"
            />
            <svg
              class="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Filter Buttons -->
        <div class="flex flex-wrap gap-4 mb-4">
          <!-- Category Filter -->
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              v-model="selectedCategory"
              class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              @change="applyFilters"
            >
              <option value="all">All Categories</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="Music">Music</option>
              <option value="Art">Art & Design</option>
              <option value="Language">Languages</option>
              <option value="Sports">Sports & Fitness</option>
              <option value="Technology">Technology</option>
              <option value="Dance">Dance</option>
            </select>
          </div>

          <!-- Age Group Filter -->
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
            <select
              v-model="selectedAgeGroup"
              class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              @change="applyFilters"
            >
              <option value="all">All Ages</option>
              <option value="5-7">5-7 years</option>
              <option value="8-10">8-10 years</option>
              <option value="11-13">11-13 years</option>
              <option value="14-16">14-16 years</option>
              <option value="17+">17+ years</option>
            </select>
          </div>

          <!-- Sort By -->
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              v-model="sortBy"
              class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              @change="applyFilters"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <!-- Active Filters Display -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
          <span class="text-sm text-gray-600">Active filters:</span>
          <button
            v-if="selectedCategory !== 'all'"
            @click="selectedCategory = 'all'; applyFilters()"
            class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1 hover:bg-indigo-200 transition-colors"
          >
            {{ selectedCategory }}
            <span class="font-bold">×</span>
          </button>
          <button
            v-if="selectedAgeGroup !== 'all'"
            @click="selectedAgeGroup = 'all'; applyFilters()"
            class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1 hover:bg-indigo-200 transition-colors"
          >
            {{ selectedAgeGroup }} years
            <span class="font-bold">×</span>
          </button>
          <button
            @click="clearAllFilters"
            class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mb-6 text-gray-600">
        Showing {{ filteredLessons.length }} of {{ allLessons.length }} lessons
      </div>

      <!-- Lessons Grid -->
      <div v-if="filteredLessons.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="lesson in filteredLessons"
          :key="lesson.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <!-- Lesson Image -->
          <div class="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500">
            <img
              :src="lesson.image"
              :alt="lesson.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-indigo-600">
              {{ lesson.category }}
            </div>
            <div
              v-if="lesson.featured"
              class="absolute top-4 left-4 bg-yellow-400 px-3 py-1 rounded-full text-sm font-bold text-gray-900"
            >
              ⭐ Featured
            </div>
          </div>

          <!-- Lesson Content -->
          <div class="p-6 flex-1 flex flex-col">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ lesson.title }}</h3>
            
            <!-- Teacher Info -->
            <div class="flex items-center gap-3 mb-3">
              <img
                :src="lesson.teacherAvatar"
                :alt="lesson.teacher"
                class="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
              />
              <div>
                <p class="text-sm font-medium text-gray-900">{{ lesson.teacher }}</p>
                <p class="text-xs text-gray-500">{{ lesson.teacherTitle }}</p>
              </div>
            </div>

            <!-- Rating -->
            <div class="flex items-center gap-2 mb-3">
              <div class="flex">
                <span v-for="i in 5" :key="i" class="text-yellow-400">
                  {{ i <= Math.floor(lesson.rating) ? '★' : '☆' }}
                </span>
              </div>
              <span class="text-sm text-gray-600">{{ lesson.rating }} ({{ lesson.reviews }} reviews)</span>
            </div>

            <!-- Description -->
            <p class="text-gray-600 mb-4 line-clamp-2 flex-1">{{ lesson.description }}</p>

            <!-- Lesson Details -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ lesson.duration }} • {{ lesson.schedule }}
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Ages {{ lesson.ageGroup }}
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ lesson.studentsEnrolled }} students enrolled
              </div>
            </div>

            <!-- Price and Action -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <span class="text-3xl font-bold text-indigo-600">${{ lesson.price }}</span>
                <span class="text-gray-500 text-sm">/{{ lesson.priceUnit }}</span>
              </div>
              <button
                @click="bookLesson(lesson)"
                class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-2xl font-bold text-gray-700 mb-2">No lessons found</h3>
        <p class="text-gray-500 mb-4">Try adjusting your filters or search query</p>
        <button
          @click="clearAllFilters"
          class="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Booking Modal -->
    <transition name="modal">
      <div
        v-if="showBookingModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
          <div class="text-center">
            <div class="mb-4 text-green-500">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h3>
            <p class="text-gray-600 mb-6">
              You've successfully booked <strong>{{ selectedLesson?.title }}</strong> with {{ selectedLesson?.teacher }}!
            </p>
            <div class="bg-indigo-50 rounded-lg p-4 mb-6 text-left">
              <h4 class="font-semibold text-gray-900 mb-2">Lesson Details:</h4>
              <p class="text-sm text-gray-600"><strong>When:</strong> {{ selectedLesson?.schedule }}</p>
              <p class="text-sm text-gray-600"><strong>Duration:</strong> {{ selectedLesson?.duration }}</p>
              <p class="text-sm text-gray-600"><strong>Price:</strong> ${{ selectedLesson?.price }}/{{ selectedLesson?.priceUnit }}</p>
            </div>
            <p class="text-sm text-gray-500 mb-6">A confirmation email has been sent to your inbox with all the details.</p>
            <button
              @click="closeModal"
              class="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// State
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedAgeGroup = ref('all')
const sortBy = ref('popular')
const showBookingModal = ref(false)
const selectedLesson = ref(null)

// Sample lessons data
const allLessons = ref([
  {
    id: 1,
    title: 'Piano Lessons for Beginners',
    category: 'Music',
    teacher: 'Sarah Johnson',
    teacherTitle: 'Concert Pianist',
    teacherAvatar: 'https://i.pravatar.cc/150?img=5',
    price: 45,
    priceUnit: 'hour',
    rating: 4.9,
    reviews: 127,
    duration: '1 hour',
    schedule: 'Mon & Wed, 4:00 PM',
    ageGroup: '8-16',
    studentsEnrolled: 34,
    description: 'Learn piano from scratch with fun, engaging lessons tailored to your pace. Perfect for beginners who want to develop strong fundamentals.',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&q=80',
    featured: true
  },
  {
    id: 2,
    title: 'Advanced Math & Problem Solving',
    category: 'Math',
    teacher: 'Dr. Michael Chen',
    teacherTitle: 'PhD Mathematics',
    teacherAvatar: 'https://i.pravatar.cc/150?img=12',
    price: 55,
    priceUnit: 'hour',
    rating: 4.8,
    reviews: 203,
    duration: '1.5 hours',
    schedule: 'Tue & Thu, 5:00 PM',
    ageGroup: '11-16',
    studentsEnrolled: 56,
    description: 'Boost your math skills with challenging problems and advanced concepts. Prepare for competitions and excel in school mathematics.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80',
    featured: false
  },
  {
    id: 3,
    title: 'Creative Art & Drawing',
    category: 'Art',
    teacher: 'Emma Rodriguez',
    teacherTitle: 'Professional Artist',
    teacherAvatar: 'https://i.pravatar.cc/150?img=9',
    price: 40,
    priceUnit: 'session',
    rating: 4.7,
    reviews: 89,
    duration: '2 hours',
    schedule: 'Saturdays, 10:00 AM',
    ageGroup: '5-13',
    studentsEnrolled: 28,
    description: 'Unleash your creativity with various art techniques including drawing, painting, and mixed media. All materials provided!',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80',
    featured: true
  },
  {
    id: 4,
    title: 'Soccer Skills Academy',
    category: 'Sports',
    teacher: 'Coach David Martinez',
    teacherTitle: 'UEFA Licensed Coach',
    teacherAvatar: 'https://i.pravatar.cc/150?img=14',
    price: 35,
    priceUnit: 'session',
    rating: 4.9,
    reviews: 156,
    duration: '1.5 hours',
    schedule: 'Mon, Wed & Fri, 4:30 PM',
    ageGroup: '7-14',
    studentsEnrolled: 67,
    description: 'Develop soccer skills, teamwork, and fitness in a fun and supportive environment. All skill levels welcome!',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&q=80',
    featured: false
  },
  {
    id: 5,
    title: 'Spanish for Kids',
    category: 'Language',
    teacher: 'Isabella Garcia',
    teacherTitle: 'Native Speaker & Educator',
    teacherAvatar: 'https://i.pravatar.cc/150?img=20',
    price: 38,
    priceUnit: 'hour',
    rating: 4.8,
    reviews: 94,
    duration: '1 hour',
    schedule: 'Tue & Thu, 4:00 PM',
    ageGroup: '5-12',
    studentsEnrolled: 42,
    description: 'Learn Spanish through games, songs, and interactive activities. Build confidence in speaking and understanding Spanish!',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&q=80',
    featured: false
  },
  {
    id: 6,
    title: 'Science Explorers Lab',
    category: 'Science',
    teacher: 'Dr. Amanda White',
    teacherTitle: 'PhD Chemistry',
    teacherAvatar: 'https://i.pravatar.cc/150?img=16',
    price: 50,
    priceUnit: 'session',
    rating: 4.9,
    reviews: 178,
    duration: '2 hours',
    schedule: 'Fridays, 4:00 PM',
    ageGroup: '8-14',
    studentsEnrolled: 51,
    description: 'Hands-on science experiments exploring physics, chemistry, and biology. Spark curiosity and love for science!',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80',
    featured: true
  },
  {
    id: 7,
    title: 'Coding & Game Development',
    category: 'Technology',
    teacher: 'Alex Thompson',
    teacherTitle: 'Software Engineer',
    teacherAvatar: 'https://i.pravatar.cc/150?img=33',
    price: 60,
    priceUnit: 'hour',
    rating: 5.0,
    reviews: 142,
    duration: '1.5 hours',
    schedule: 'Wed & Sat, 3:00 PM',
    ageGroup: '10-17',
    studentsEnrolled: 73,
    description: 'Learn to code and create your own games using Python and Scratch. Perfect for future programmers and game designers!',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&q=80',
    featured: false
  },
  {
    id: 8,
    title: 'Ballet & Contemporary Dance',
    category: 'Dance',
    teacher: 'Sophia Anderson',
    teacherTitle: 'Professional Dancer',
    teacherAvatar: 'https://i.pravatar.cc/150?img=23',
    price: 42,
    priceUnit: 'session',
    rating: 4.8,
    reviews: 116,
    duration: '1.5 hours',
    schedule: 'Mon & Wed, 5:30 PM',
    ageGroup: '6-14',
    studentsEnrolled: 39,
    description: 'Develop grace, strength, and expression through classical ballet and contemporary dance techniques.',
    image: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=500&q=80',
    featured: false
  },
  {
    id: 9,
    title: 'Guitar Masterclass',
    category: 'Music',
    teacher: 'Jake Morrison',
    teacherTitle: 'Professional Guitarist',
    teacherAvatar: 'https://i.pravatar.cc/150?img=52',
    price: 48,
    priceUnit: 'hour',
    rating: 4.7,
    reviews: 98,
    duration: '1 hour',
    schedule: 'Tue & Thu, 6:00 PM',
    ageGroup: '10-17',
    studentsEnrolled: 45,
    description: 'Master the guitar with lessons in rock, blues, and classical styles. Learn chords, solos, and songwriting!',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80',
    featured: false
  },
  {
    id: 10,
    title: 'Creative Writing Workshop',
    category: 'Language',
    teacher: 'Rachel Brooks',
    teacherTitle: 'Published Author',
    teacherAvatar: 'https://i.pravatar.cc/150?img=26',
    price: 44,
    priceUnit: 'session',
    rating: 4.9,
    reviews: 87,
    duration: '2 hours',
    schedule: 'Saturdays, 2:00 PM',
    ageGroup: '11-16',
    studentsEnrolled: 31,
    description: 'Develop storytelling skills, creative expression, and writing techniques. Perfect for aspiring young authors!',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80',
    featured: false
  },
  {
    id: 11,
    title: 'Robotics & Engineering',
    category: 'Technology',
    teacher: 'Dr. Kevin Park',
    teacherTitle: 'Robotics Engineer',
    teacherAvatar: 'https://i.pravatar.cc/150?img=60',
    price: 65,
    priceUnit: 'session',
    rating: 5.0,
    reviews: 134,
    duration: '2 hours',
    schedule: 'Thursdays, 4:00 PM',
    ageGroup: '12-17',
    studentsEnrolled: 48,
    description: 'Build and program robots! Learn engineering principles, coding, and problem-solving with hands-on projects.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80',
    featured: true
  },
  {
    id: 12,
    title: 'Tennis Academy',
    category: 'Sports',
    teacher: 'Coach Maria Santos',
    teacherTitle: 'Professional Tennis Coach',
    teacherAvatar: 'https://i.pravatar.cc/150?img=47',
    price: 52,
    priceUnit: 'hour',
    rating: 4.8,
    reviews: 121,
    duration: '1 hour',
    schedule: 'Mon, Wed & Fri, 5:00 PM',
    ageGroup: '8-16',
    studentsEnrolled: 58,
    description: 'Improve your tennis game with professional coaching. Learn technique, strategy, and sportsmanship!',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&q=80',
    featured: false
  }
])

// Computed
const filteredLessons = computed(() => {
  let lessons = [...allLessons.value]

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    lessons = lessons.filter(
      lesson =>
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query) ||
        lesson.teacher.toLowerCase().includes(query) ||
        lesson.category.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (selectedCategory.value !== 'all') {
    lessons = lessons.filter(lesson => lesson.category === selectedCategory.value)
  }

  // Apply age group filter
  if (selectedAgeGroup.value !== 'all') {
    lessons = lessons.filter(lesson => {
      const ageRange = lesson.ageGroup
      const filterAge = selectedAgeGroup.value
      
      if (filterAge === '17+') {
        return ageRange.includes('17')
      }
      
      return ageRange === filterAge || ageRange.includes(filterAge.split('-')[0])
    })
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'price-low':
      lessons.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      lessons.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      lessons.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      lessons.sort((a, b) => b.id - a.id)
      break
    case 'popular':
    default:
      lessons.sort((a, b) => b.studentsEnrolled - a.studentsEnrolled)
      break
  }

  return lessons
})

const hasActiveFilters = computed(() => {
  return selectedCategory.value !== 'all' || selectedAgeGroup.value !== 'all'
})

// Methods
const handleSearch = () => {
  // Debounced search is handled by the computed property
}

const applyFilters = () => {
  // Filters are automatically applied via computed property
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedAgeGroup.value = 'all'
  sortBy.value = 'popular'
}

const bookLesson = (lesson) => {
  selectedLesson.value = lesson
  showBookingModal.value = true
}

const closeModal = () => {
  showBookingModal.value = false
  setTimeout(() => {
    selectedLesson.value = null
  }, 300)
}

onMounted(() => {
  console.log('Lesson Marketplace loaded!')
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>

