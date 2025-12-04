// API Service for AfterSchool Hub Frontend
// This file provides easy integration with the backend API

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://fullstack-vue-project-10x2.onrender.com/api";

class ApiService {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    // Always get the latest token from localStorage
    const token = localStorage.getItem("token") || this.token;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Update instance token for consistency
      this.token = token;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Create error with message and additional data
        const error = new Error(data.message || "API request failed");
        error.response = data;
        error.status = response.status;
        throw error;
      }

      return data;
    } catch (error) {
      // If it's already our custom error, re-throw it
      if (error.response) {
        throw error;
      }
      // Network or other errors
      console.error("API request error:", error);
      throw new Error(
        error.message || "Network error. Please check your connection."
      );
    }
  }

  // Authentication API
  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    const response = await this.request("/auth/logout", {
      method: "POST",
    });
    this.clearToken();
    return response;
  }

  async getCurrentUser() {
    return this.request("/auth/me");
  }

  async updateProfile(profileData) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Lessons API
  async getLessons(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/lessons?${queryString}` : "/lessons";
    return this.request(endpoint);
  }

  async getLesson(id) {
    return this.request(`/lessons/${id}`);
  }

  async getCategories() {
    return this.request("/lessons/categories");
  }

  async getFeaturedLessons(limit = 6) {
    return this.request(`/lessons/featured?limit=${limit}`);
  }

  // Cart API
  async getCart() {
    return this.request("/cart");
  }

  async addToCart(lessonId, quantity = 1) {
    return this.request("/cart/add", {
      method: "POST",
      body: JSON.stringify({ lesson_id: lessonId, quantity }),
    });
  }

  async updateCartItem(lessonId, quantity) {
    return this.request("/cart/update", {
      method: "PUT",
      body: JSON.stringify({ lesson_id: lessonId, quantity }),
    });
  }

  async removeFromCart(lessonId) {
    return this.request("/cart/remove", {
      method: "DELETE",
      body: JSON.stringify({ lesson_id: lessonId }),
    });
  }

  async clearCart() {
    return this.request("/cart/clear", {
      method: "DELETE",
    });
  }

  async getCartCount() {
    return this.request("/cart/count");
  }

  // Enrollment API
  async checkout(checkoutData) {
    return this.request("/enrollments/checkout", {
      method: "POST",
      body: JSON.stringify(checkoutData),
    });
  }

  async getEnrollments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `/enrollments?${queryString}`
      : "/enrollments";
    return this.request(endpoint);
  }

  async getEnrollment(id) {
    return this.request(`/enrollments/${id}`);
  }

  async cancelEnrollment(id, reason) {
    return this.request(`/enrollments/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    });
  }

  async getEnrollmentSummary() {
    return this.request("/enrollments/summary");
  }

  // Users API
  async getUserProfile() {
    return this.request("/users/profile");
  }

  async getUserEnrollments() {
    return this.request("/users/enrollments");
  }

  async getUserReviews() {
    return this.request("/users/reviews");
  }

  async addReview(reviewData) {
    return this.request("/users/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  }

  async getUserDashboard() {
    return this.request("/users/dashboard");
  }

  // Teacher Profile API
  async getTeacherProfile() {
    return this.request("/users/teacher-profile");
  }

  async createTeacherProfile(profileData) {
    return this.request("/users/teacher-profile", {
      method: "POST",
      body: JSON.stringify(profileData),
    });
  }

  async updateTeacherProfile(profileData) {
    return this.request("/users/teacher-profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

export default apiService;

// Example usage in Vue components:
/*
import apiService from '@/services/api.js';

// In your Vue component
export default {
  async mounted() {
    try {
      // Get lessons
      const response = await apiService.getLessons({ category: 'Music' });
      this.lessons = response.data.lessons;
      
      // Add to cart (requires authentication)
      await apiService.addToCart(1, 2);
      
      // Get user profile
      const profile = await apiService.getCurrentUser();
      this.user = profile.data.user;
    } catch (error) {
      console.error('API Error:', error);
    }
  }
}
*/
