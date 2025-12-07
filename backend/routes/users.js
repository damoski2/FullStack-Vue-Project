import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Lesson from "../models/Lesson.js";
import Category from "../models/Category.js";
import Teacher from "../models/Teacher.js";
import {
  authenticateToken,
  requireAdmin,
  requireTeacher,
} from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      zip: user.zip,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };

    res.json({
      success: true,
      data: { user: userData },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
});

// @route   GET /api/users/enrollments
// @desc    Get user's enrollments with lesson details
// @access  Private
router.get("/enrollments", authenticateToken, async (req, res) => {
  try {
    const enrollments = await Order.find({ user_id: req.user.id })
      .populate({
        path: "lesson_id",
        populate: [
          { path: "category_id", select: "name" },
          { path: "teacher_id", select: "name title avatar" },
        ],
      })
      .sort({ enrolled_at: -1 })
      .lean();

    const transformedEnrollments = enrollments.map((enrollment) => ({
      ...enrollment,
      id: enrollment._id.toString(),
      user_id: enrollment.user_id.toString(),
      lesson_id: enrollment.lesson_id?._id.toString(),
      title: enrollment.lesson_id?.title,
      description: enrollment.lesson_id?.description,
      image: enrollment.lesson_id?.image,
      duration: enrollment.lesson_id?.duration,
      schedule: enrollment.lesson_id?.schedule,
      age_group: enrollment.lesson_id?.age_group,
      category_name: enrollment.lesson_id?.category_id?.name,
      teacher_name: enrollment.lesson_id?.teacher_id?.name,
      teacher_title: enrollment.lesson_id?.teacher_id?.title,
      teacher_avatar: enrollment.lesson_id?.teacher_id?.avatar,
      enrolled_at: enrollment.enrolled_at || enrollment.createdAt,
    }));

    res.json({
      success: true,
      data: { enrollments: transformedEnrollments },
    });
  } catch (error) {
    console.error("Get user enrollments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching enrollments",
    });
  }
});

// @route   GET /api/users/reviews
// @desc    Get user's reviews
// @access  Private
router.get("/reviews", authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find({ user_id: req.user.id })
      .populate({
        path: "lesson_id",
        populate: { path: "category_id", select: "name" },
      })
      .sort({ createdAt: -1 })
      .lean();

    const transformedReviews = reviews.map((review) => ({
      ...review,
      id: review._id.toString(),
      user_id: review.user_id.toString(),
      lesson_id: review.lesson_id?._id.toString(),
      title: review.lesson_id?.title,
      image: review.lesson_id?.image,
      category_name: review.lesson_id?.category_id?.name,
      created_at: review.createdAt,
    }));

    res.json({
      success: true,
      data: { reviews: transformedReviews },
    });
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching reviews",
    });
  }
});

// @route   POST /api/users/reviews
// @desc    Add a review for a lesson
// @access  Private
router.post(
  "/reviews",
  authenticateToken,
  [
    body("lesson_id").notEmpty().withMessage("Lesson ID is required"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Comment must be less than 500 characters"),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { lesson_id, rating, comment } = req.body;

      // Check if user is enrolled in this lesson
      const enrollment = await Order.findOne({
        user_id: req.user.id,
        lesson_id: lesson_id,
        status: { $in: ["confirmed", "completed"] },
      });

      if (!enrollment) {
        return res.status(400).json({
          success: false,
          message: "You must be enrolled in this lesson to review it",
        });
      }

      // Check if user already reviewed this lesson
      const existingReview = await Review.findOne({
        user_id: req.user.id,
        lesson_id: lesson_id,
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed this lesson",
        });
      }

      // Create review
      const review = await Review.create({
        user_id: req.user.id,
        lesson_id: lesson_id,
        rating,
        comment,
      });

      // Update lesson rating
      const lessonReviews = await Review.find({ lesson_id: lesson_id });

      const averageRating =
        lessonReviews.reduce((sum, review) => sum + review.rating, 0) /
        lessonReviews.length;

      await Lesson.findByIdAndUpdate(lesson_id, {
        rating: averageRating,
        reviews: lessonReviews.length,
      });

      const reviewData = {
        id: review._id.toString(),
        user_id: review.user_id.toString(),
        lesson_id: review.lesson_id.toString(),
        rating: review.rating,
        comment: review.comment,
        created_at: review.createdAt,
      };

      res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: { review: reviewData },
      });
    } catch (error) {
      console.error("Add review error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while adding review",
      });
    }
  }
);

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    // Get user stats
    const totalEnrollments = await Order.countDocuments({
      user_id: req.user.id,
    });
    const activeEnrollments = await Order.countDocuments({
      user_id: req.user.id,
      status: "confirmed",
    });
    const totalReviews = await Review.countDocuments({
      user_id: req.user.id,
    });
    const paidEnrollments = await Order.find({
      user_id: req.user.id,
      payment_status: "paid",
    });
    const totalSpent = paidEnrollments.reduce(
      (sum, e) => sum + (e.total_amount || 0),
      0
    );

    const stats = {
      total_enrollments: totalEnrollments,
      active_enrollments: activeEnrollments,
      total_reviews: totalReviews,
      total_spent: totalSpent,
    };

    // Get recent enrollments
    const recentEnrollments = await Order.find({ user_id: req.user.id })
      .populate({
        path: "lesson_id",
        populate: { path: "category_id", select: "name" },
      })
      .sort({ enrolled_at: -1 })
      .limit(5)
      .lean();

    const transformedRecent = recentEnrollments.map((e) => ({
      ...e,
      id: e._id.toString(),
      title: e.lesson_id?.title,
      image: e.lesson_id?.image,
      category_name: e.lesson_id?.category_id?.name,
      enrolled_at: e.enrolled_at || e.createdAt,
    }));

    // Get upcoming lessons (if any)
    const upcomingLessons = await Order.find({
      user_id: req.user.id,
      status: "confirmed",
    })
      .populate({
        path: "lesson_id",
        populate: [
          { path: "category_id", select: "name" },
          { path: "teacher_id", select: "name" },
        ],
      })
      .sort({ enrolled_at: 1 })
      .limit(5)
      .lean();

    const transformedUpcoming = upcomingLessons.map((e) => ({
      ...e.lesson_id,
      id: e.lesson_id?._id.toString(),
      category_name: e.lesson_id?.category_id?.name,
      teacher_name: e.lesson_id?.teacher_id?.name,
    }));

    res.json({
      success: true,
      data: {
        stats,
        recentEnrollments: transformedRecent,
        upcomingLessons: transformedUpcoming,
      },
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard data",
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const transformedUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      zip: user.zip,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    }));

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        users: transformedUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
});

// @route   GET /api/users/teacher-profile
// @desc    Get teacher profile
// @access  Private (Teacher only)
router.get(
  "/teacher-profile",
  authenticateToken,
  requireTeacher,
  async (req, res) => {
    try {
      const teacher = await Teacher.findOne({ user_id: req.user.id });

      if (!teacher) {
        return res.json({
          success: true,
          data: { teacher: null },
          message: "Teacher profile not created yet",
        });
      }

      const teacherData = {
        id: teacher._id.toString(),
        user_id: teacher.user_id.toString(),
        name: teacher.name,
        title: teacher.title,
        avatar: teacher.avatar,
        bio: teacher.bio,
        credentials: teacher.credentials,
        experience_years: teacher.experience_years,
        rating: teacher.rating,
        total_reviews: teacher.total_reviews,
        created_at: teacher.createdAt,
        updated_at: teacher.updatedAt,
      };

      res.json({
        success: true,
        data: { teacher: teacherData },
      });
    } catch (error) {
      console.error("Get teacher profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching teacher profile",
      });
    }
  }
);

// @route   POST /api/users/teacher-profile
// @desc    Create teacher profile
// @access  Private (Teacher only)
router.post(
  "/teacher-profile",
  authenticateToken,
  requireTeacher,
  [
    body("title")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Title must be at least 2 characters")
      .isLength({ max: 100 })
      .withMessage("Title must be less than 100 characters"),
    body("bio")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Bio must be less than 1000 characters"),
    body("credentials")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Credentials must be less than 500 characters"),
    body("avatar")
      .optional()
      .trim()
      .isURL()
      .withMessage("Avatar must be a valid URL")
      .isLength({ max: 500 })
      .withMessage("Avatar URL must be less than 500 characters"),
    body("experience_years")
      .optional()
      .isInt({ min: 0, max: 50 })
      .withMessage("Experience years must be between 0 and 50"),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      // Check if teacher profile already exists
      const existingTeacher = await Teacher.findOne({ user_id: req.user.id });
      if (existingTeacher) {
        return res.status(400).json({
          success: false,
          message: "Teacher profile already exists. Use PUT to update.",
        });
      }

      // Get user info
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const { title, bio, credentials, avatar, experience_years } = req.body;

      // Create teacher profile
      const teacher = await Teacher.create({
        user_id: req.user.id,
        name: user.name,
        title: title.trim(),
        bio: bio?.trim() || "",
        credentials: credentials?.trim() || "",
        avatar: avatar?.trim() || "",
        experience_years: experience_years || 0,
      });

      const teacherData = {
        id: teacher._id.toString(),
        user_id: teacher.user_id.toString(),
        name: teacher.name,
        title: teacher.title,
        avatar: teacher.avatar,
        bio: teacher.bio,
        credentials: teacher.credentials,
        experience_years: teacher.experience_years,
        rating: teacher.rating,
        total_reviews: teacher.total_reviews,
        created_at: teacher.createdAt,
        updated_at: teacher.updatedAt,
      };

      res.status(201).json({
        success: true,
        message: "Teacher profile created successfully",
        data: { teacher: teacherData },
      });
    } catch (error) {
      console.error("Create teacher profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while creating teacher profile",
      });
    }
  }
);

// @route   PUT /api/users/teacher-profile
// @desc    Update teacher profile
// @access  Private (Teacher only)
router.put(
  "/teacher-profile",
  authenticateToken,
  requireTeacher,
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Title must be at least 2 characters")
      .isLength({ max: 100 })
      .withMessage("Title must be less than 100 characters"),
    body("bio")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Bio must be less than 1000 characters"),
    body("credentials")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Credentials must be less than 500 characters"),
    body("avatar")
      .optional()
      .trim()
      .isURL()
      .withMessage("Avatar must be a valid URL")
      .isLength({ max: 500 })
      .withMessage("Avatar URL must be less than 500 characters"),
    body("experience_years")
      .optional()
      .isInt({ min: 0, max: 50 })
      .withMessage("Experience years must be between 0 and 50"),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      // Find teacher profile
      const teacher = await Teacher.findOne({ user_id: req.user.id });
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher profile not found. Create it first using POST.",
        });
      }

      const { title, bio, credentials, avatar, experience_years } = req.body;
      const updateData = {};

      if (title !== undefined) updateData.title = title.trim();
      if (bio !== undefined) updateData.bio = bio.trim();
      if (credentials !== undefined)
        updateData.credentials = credentials.trim();
      if (avatar !== undefined) updateData.avatar = avatar.trim();
      if (experience_years !== undefined)
        updateData.experience_years = experience_years;

      // Update user name if it changed
      const user = await User.findById(req.user.id);
      if (user && user.name !== teacher.name) {
        updateData.name = user.name;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        });
      }

      // Update teacher profile
      const updatedTeacher = await Teacher.findByIdAndUpdate(
        teacher._id,
        updateData,
        { new: true, runValidators: true }
      );

      const teacherData = {
        id: updatedTeacher._id.toString(),
        user_id: updatedTeacher.user_id.toString(),
        name: updatedTeacher.name,
        title: updatedTeacher.title,
        avatar: updatedTeacher.avatar,
        bio: updatedTeacher.bio,
        credentials: updatedTeacher.credentials,
        experience_years: updatedTeacher.experience_years,
        rating: updatedTeacher.rating,
        total_reviews: updatedTeacher.total_reviews,
        created_at: updatedTeacher.createdAt,
        updated_at: updatedTeacher.updatedAt,
      };

      res.json({
        success: true,
        message: "Teacher profile updated successfully",
        data: { teacher: teacherData },
      });
    } catch (error) {
      console.error("Update teacher profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating teacher profile",
      });
    }
  }
);

export default router;
