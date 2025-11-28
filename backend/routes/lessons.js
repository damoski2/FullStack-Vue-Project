import express from "express";
import { body, validationResult } from "express-validator";
import Lesson from "../models/Lesson.js";
import Category from "../models/Category.js";
import Teacher from "../models/Teacher.js";
import Review from "../models/Review.js";
import {
  authenticateToken,
  requireAdmin,
  requireTeacher,
  optionalAuth,
} from "../middleware/auth.js";
import { uploadSingle, handleUploadError } from "../middleware/upload.js";

const router = express.Router();

// @route   GET /api/lessons
// @desc    Get all lessons with filtering and pagination
// @access  Public
router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      category,
      featured,
      available,
      search,
      minPrice,
      maxPrice,
      ageGroup,
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) {
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        filter.category_id = categoryDoc._id;
      } else {
        // If category not found, return empty results
        return res.json({
          success: true,
          data: {
            lessons: [],
            pagination: {
              currentPage: parseInt(page),
              totalPages: 0,
              totalItems: 0,
              itemsPerPage: parseInt(limit),
              hasNextPage: false,
              hasPrevPage: false,
            },
          },
        });
      }
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (available !== undefined) {
      filter.available = available === "true";
    }

    if (minPrice) {
      filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    }

    if (ageGroup) {
      filter.age_group = { $regex: ageGroup, $options: "i" };
    }

    // Build search query
    if (search) {
      const teacherIds = await Teacher.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { teacher_id: { $in: teacherIds.map((t) => t._id) } },
      ];
    }

    // Build sort object
    const validSortFields = [
      "createdAt",
      "price",
      "rating",
      "title",
      "students_enrolled",
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sort = {};
    sort[sortField] = sortOrder.toLowerCase() === "asc" ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get lessons with populated fields
    const lessons = await Lesson.find(filter)
      .populate("category_id", "name icon")
      .populate("teacher_id", "name title avatar rating")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Transform lessons to match expected format
    const transformedLessons = lessons.map((lesson) => ({
      ...lesson,
      id: lesson._id.toString(),
      category_name: lesson.category_id?.name,
      category_icon: lesson.category_id?.icon,
      teacher_name: lesson.teacher_id?.name,
      teacher_title: lesson.teacher_id?.title,
      teacher_avatar: lesson.teacher_id?.avatar,
      teacher_rating: lesson.teacher_id?.rating,
      category_id: lesson.category_id?._id.toString(),
      teacher_id: lesson.teacher_id?._id.toString(),
      created_at: lesson.createdAt,
      updated_at: lesson.updatedAt,
    }));

    // Get total count
    const total = await Lesson.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        lessons: transformedLessons,
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
    console.error("Get lessons error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching lessons",
    });
  }
});

// @route   GET /api/lessons/categories
// @desc    Get all categories
// @access  Public
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "lessons",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$category_id", "$$categoryId"] },
                    { $eq: ["$available", true] },
                  ],
                },
              },
            },
          ],
          as: "lessons",
        },
      },
      {
        $addFields: {
          lesson_count: { $size: "$lessons" },
        },
      },
      {
        $project: {
          lessons: 0,
        },
      },
      {
        $sort: { name: 1 },
      },
    ]);

    const transformedCategories = categories.map((cat) => ({
      id: cat._id.toString(),
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      lesson_count: cat.lesson_count,
      created_at: cat.createdAt,
    }));

    res.json({
      success: true,
      data: { categories: transformedCategories },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
});

// @route   GET /api/lessons/featured
// @desc    Get featured lessons
// @access  Public
router.get("/featured", async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const lessons = await Lesson.find({
      featured: true,
      available: true,
    })
      .populate("category_id", "name icon")
      .populate("teacher_id", "name title avatar")
      .sort({ rating: -1, students_enrolled: -1 })
      .limit(parseInt(limit))
      .lean();

    const transformedLessons = lessons.map((lesson) => ({
      ...lesson,
      id: lesson._id.toString(),
      category_name: lesson.category_id?.name,
      category_icon: lesson.category_id?.icon,
      teacher_name: lesson.teacher_id?.name,
      teacher_title: lesson.teacher_id?.title,
      teacher_avatar: lesson.teacher_id?.avatar,
      category_id: lesson.category_id?._id.toString(),
      teacher_id: lesson.teacher_id?._id.toString(),
      created_at: lesson.createdAt,
      updated_at: lesson.updatedAt,
    }));

    res.json({
      success: true,
      data: { lessons: transformedLessons },
    });
  } catch (error) {
    console.error("Get featured lessons error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured lessons",
    });
  }
});

// @route   GET /api/lessons/:id
// @desc    Get single lesson by ID
// @access  Public
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id)
      .populate("category_id", "name icon description")
      .populate("teacher_id", "name title avatar bio credentials experience_years rating total_reviews")
      .lean();

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Transform lesson
    const transformedLesson = {
      ...lesson,
      id: lesson._id.toString(),
      category_name: lesson.category_id?.name,
      category_icon: lesson.category_id?.icon,
      category_description: lesson.category_id?.description,
      teacher_name: lesson.teacher_id?.name,
      teacher_title: lesson.teacher_id?.title,
      teacher_avatar: lesson.teacher_id?.avatar,
      teacher_bio: lesson.teacher_id?.bio,
      teacher_credentials: lesson.teacher_id?.credentials,
      teacher_experience: lesson.teacher_id?.experience_years,
      teacher_rating: lesson.teacher_id?.rating,
      teacher_total_reviews: lesson.teacher_id?.total_reviews,
      category_id: lesson.category_id?._id.toString(),
      teacher_id: lesson.teacher_id?._id.toString(),
      created_at: lesson.createdAt,
      updated_at: lesson.updatedAt,
    };

    // Get similar lessons (same category)
    const similarLessons = await Lesson.find({
      category_id: lesson.category_id?._id,
      _id: { $ne: lesson._id },
      available: true,
    })
      .populate("category_id", "name")
      .populate("teacher_id", "name title avatar")
      .sort({ rating: -1 })
      .limit(4)
      .lean();

    const transformedSimilar = similarLessons.map((l) => ({
      ...l,
      id: l._id.toString(),
      category_name: l.category_id?.name,
      teacher_name: l.teacher_id?.name,
      teacher_title: l.teacher_id?.title,
      teacher_avatar: l.teacher_id?.avatar,
      category_id: l.category_id?._id.toString(),
      teacher_id: l.teacher_id?._id.toString(),
      created_at: l.createdAt,
      updated_at: l.updatedAt,
    }));

    // Get reviews for this lesson
    const reviews = await Review.find({ lesson_id: id })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const transformedReviews = reviews.map((review) => ({
      ...review,
      id: review._id.toString(),
      user_name: review.user_id?.name,
      user_email: review.user_id?.email,
      user_id: review.user_id?._id.toString(),
      created_at: review.createdAt,
    }));

    res.json({
      success: true,
      data: {
        lesson: transformedLesson,
        similarLessons: transformedSimilar,
        reviews: transformedReviews,
      },
    });
  } catch (error) {
    console.error("Get lesson error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching lesson",
    });
  }
});

// @route   POST /api/lessons
// @desc    Create a new lesson
// @access  Private (Admin/Teacher)
router.post(
  "/",
  authenticateToken,
  requireTeacher,
  uploadSingle("image"),
  handleUploadError,
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),
    body("category_id")
      .notEmpty()
      .withMessage("Category ID is required"),
    body("teacher_id")
      .notEmpty()
      .withMessage("Teacher ID is required"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("price_unit")
      .isIn(["hour", "session", "month"])
      .withMessage("Price unit must be hour, session, or month"),
    body("duration").trim().notEmpty().withMessage("Duration is required"),
    body("schedule").trim().notEmpty().withMessage("Schedule is required"),
    body("age_group").trim().notEmpty().withMessage("Age group is required"),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters"),
    body("features").optional().isString(),
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

      const {
        title,
        category_id,
        teacher_id,
        price,
        price_unit,
        duration,
        schedule,
        age_group,
        description,
        features,
        max_students = 20,
        featured = false,
      } = req.body;

      // Check if category exists
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }

      // Check if teacher exists
      const teacher = await Teacher.findById(teacher_id);
      if (!teacher) {
        return res.status(400).json({
          success: false,
          message: "Teacher not found",
        });
      }

      // Handle image upload
      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      // Parse features if it's a string
      let featuresArray = [];
      if (features) {
        try {
          featuresArray =
            typeof features === "string" ? JSON.parse(features) : features;
        } catch (e) {
          featuresArray = features.split(",").map((f) => f.trim());
        }
      }

      // Create lesson
      const lesson = await Lesson.create({
        title,
        category_id,
        teacher_id,
        price,
        price_unit,
        duration,
        schedule,
        age_group,
        description,
        image: imageUrl,
        features: featuresArray,
        max_students,
        featured: featured || false,
        available: true,
      });

      // Populate and transform
      await lesson.populate("category_id", "name");
      await lesson.populate("teacher_id", "name title avatar");

      const transformedLesson = {
        ...lesson.toObject(),
        id: lesson._id.toString(),
        category_name: lesson.category_id?.name,
        teacher_name: lesson.teacher_id?.name,
        teacher_title: lesson.teacher_id?.title,
        teacher_avatar: lesson.teacher_id?.avatar,
        category_id: lesson.category_id?._id.toString(),
        teacher_id: lesson.teacher_id?._id.toString(),
        created_at: lesson.createdAt,
        updated_at: lesson.updatedAt,
      };

      res.status(201).json({
        success: true,
        message: "Lesson created successfully",
        data: { lesson: transformedLesson },
      });
    } catch (error) {
      console.error("Create lesson error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while creating lesson",
      });
    }
  }
);

// @route   PUT /api/lessons/:id
// @desc    Update a lesson
// @access  Private (Admin/Teacher)
router.put(
  "/:id",
  authenticateToken,
  requireTeacher,
  uploadSingle("image"),
  handleUploadError,
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("description")
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters"),
  ],
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if lesson exists
      const existingLesson = await Lesson.findById(id);
      if (!existingLesson) {
        return res.status(404).json({
          success: false,
          message: "Lesson not found",
        });
      }

      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        title,
        category_id,
        teacher_id,
        price,
        price_unit,
        duration,
        schedule,
        age_group,
        description,
        features,
        max_students,
        featured,
        available,
      } = req.body;

      // Build update object
      const updateData = {};

      if (title) updateData.title = title;
      if (category_id) updateData.category_id = category_id;
      if (teacher_id) updateData.teacher_id = teacher_id;
      if (price !== undefined) updateData.price = price;
      if (price_unit) updateData.price_unit = price_unit;
      if (duration) updateData.duration = duration;
      if (schedule) updateData.schedule = schedule;
      if (age_group) updateData.age_group = age_group;
      if (description) updateData.description = description;
      if (features) {
        let featuresArray = [];
        try {
          featuresArray =
            typeof features === "string" ? JSON.parse(features) : features;
        } catch (e) {
          featuresArray = features.split(",").map((f) => f.trim());
        }
        updateData.features = featuresArray;
      }
      if (max_students !== undefined) updateData.max_students = max_students;
      if (featured !== undefined) updateData.featured = featured;
      if (available !== undefined) updateData.available = available;

      // Handle image upload
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        });
      }

      // Update lesson
      const lesson = await Lesson.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate("category_id", "name")
        .populate("teacher_id", "name title avatar")
        .lean();

      const transformedLesson = {
        ...lesson,
        id: lesson._id.toString(),
        category_name: lesson.category_id?.name,
        teacher_name: lesson.teacher_id?.name,
        teacher_title: lesson.teacher_id?.title,
        teacher_avatar: lesson.teacher_id?.avatar,
        category_id: lesson.category_id?._id.toString(),
        teacher_id: lesson.teacher_id?._id.toString(),
        created_at: lesson.createdAt,
        updated_at: lesson.updatedAt,
      };

      res.json({
        success: true,
        message: "Lesson updated successfully",
        data: { lesson: transformedLesson },
      });
    } catch (error) {
      console.error("Update lesson error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating lesson",
      });
    }
  }
);

// @route   DELETE /api/lessons/:id
// @desc    Delete a lesson
// @access  Private (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if lesson exists
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Delete lesson
    await Lesson.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("Delete lesson error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting lesson",
    });
  }
});

export default router;
