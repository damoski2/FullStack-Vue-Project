import express from "express";
import { body, validationResult } from "express-validator";
import { dbQuery, dbGet, dbRun } from "../config/database.js";
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
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query;

    let sql = `
      SELECT 
        l.*,
        c.name as category_name,
        c.icon as category_icon,
        t.name as teacher_name,
        t.title as teacher_title,
        t.avatar as teacher_avatar,
        t.rating as teacher_rating
      FROM lessons l
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      WHERE 1=1
    `;

    const params = [];
    const conditions = [];

    // Apply filters
    if (category) {
      conditions.push("c.name = ?");
      params.push(category);
    }

    if (featured !== undefined) {
      conditions.push("l.featured = ?");
      params.push(featured === "true" ? 1 : 0);
    }

    if (available !== undefined) {
      conditions.push("l.available = ?");
      params.push(available === "true" ? 1 : 0);
    }

    if (search) {
      conditions.push(
        "(l.title LIKE ? OR l.description LIKE ? OR t.name LIKE ?)"
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      conditions.push("l.price >= ?");
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      conditions.push("l.price <= ?");
      params.push(parseFloat(maxPrice));
    }

    if (ageGroup) {
      conditions.push("l.age_group LIKE ?");
      params.push(`%${ageGroup}%`);
    }

    if (conditions.length > 0) {
      sql += " AND " + conditions.join(" AND ");
    }

    // Add sorting
    const validSortFields = [
      "created_at",
      "price",
      "rating",
      "title",
      "students_enrolled",
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "created_at";
    const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
    sql += ` ORDER BY l.${sortField} ${order}`;

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const lessons = await dbQuery(sql, params);

    // Get total count for pagination
    let countSql = `
      SELECT COUNT(*) as total
      FROM lessons l
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      WHERE 1=1
    `;

    if (conditions.length > 0) {
      countSql += " AND " + conditions.join(" AND ");
    }

    const countResult = await dbGet(countSql, params.slice(0, -2)); // Remove limit and offset
    const total = countResult.total;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        lessons,
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
    const categories = await dbQuery(`
      SELECT c.*, COUNT(l.id) as lesson_count
      FROM categories c
      LEFT JOIN lessons l ON c.id = l.category_id AND l.available = 1
      GROUP BY c.id
      ORDER BY c.name
    `);

    res.json({
      success: true,
      data: { categories },
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

    const lessons = await dbQuery(
      `
      SELECT 
        l.*,
        c.name as category_name,
        c.icon as category_icon,
        t.name as teacher_name,
        t.title as teacher_title,
        t.avatar as teacher_avatar
      FROM lessons l
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      WHERE l.featured = 1 AND l.available = 1
      ORDER BY l.rating DESC, l.students_enrolled DESC
      LIMIT ?
    `,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      data: { lessons },
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

    const lesson = await dbGet(
      `
      SELECT 
        l.*,
        c.name as category_name,
        c.icon as category_icon,
        c.description as category_description,
        t.name as teacher_name,
        t.title as teacher_title,
        t.avatar as teacher_avatar,
        t.bio as teacher_bio,
        t.credentials as teacher_credentials,
        t.experience_years as teacher_experience,
        t.rating as teacher_rating,
        t.total_reviews as teacher_total_reviews
      FROM lessons l
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      WHERE l.id = ?
    `,
      [id]
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Get similar lessons (same category)
    const similarLessons = await dbQuery(
      `
      SELECT 
        l.*,
        c.name as category_name,
        t.name as teacher_name,
        t.title as teacher_title,
        t.avatar as teacher_avatar
      FROM lessons l
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      WHERE l.category_id = ? AND l.id != ? AND l.available = 1
      ORDER BY l.rating DESC
      LIMIT 4
    `,
      [lesson.category_id, id]
    );

    // Get reviews for this lesson
    const reviews = await dbQuery(
      `
      SELECT 
        r.*,
        u.name as user_name,
        u.email as user_email
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.lesson_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `,
      [id]
    );

    res.json({
      success: true,
      data: {
        lesson,
        similarLessons,
        reviews,
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
      .isInt()
      .withMessage("Category ID must be a valid integer"),
    body("teacher_id")
      .isInt()
      .withMessage("Teacher ID must be a valid integer"),
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
      const category = await dbGet("SELECT id FROM categories WHERE id = ?", [
        category_id,
      ]);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }

      // Check if teacher exists
      const teacher = await dbGet("SELECT id FROM teachers WHERE id = ?", [
        teacher_id,
      ]);
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
      const result = await dbRun(
        `
      INSERT INTO lessons (
        title, category_id, teacher_id, price, price_unit, duration, 
        schedule, age_group, description, image, features, max_students, 
        featured, available
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [
          title,
          category_id,
          teacher_id,
          price,
          price_unit,
          duration,
          schedule,
          age_group,
          description,
          imageUrl,
          JSON.stringify(featuresArray),
          max_students,
          featured ? 1 : 0,
          1,
        ]
      );

      // Get the created lesson
      const lesson = await dbGet(
        `
      SELECT 
        l.*,
        c.name as category_name,
        t.name as teacher_name,
        t.title as teacher_title,
        t.avatar as teacher_avatar
      FROM lessons l
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      WHERE l.id = ?
    `,
        [result.id]
      );

      res.status(201).json({
        success: true,
        message: "Lesson created successfully",
        data: { lesson },
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
      const updateFields = [];
      const updateValues = [];

      // Check if lesson exists
      const existingLesson = await dbGet("SELECT * FROM lessons WHERE id = ?", [
        id,
      ]);
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

      // Build update query dynamically
      if (title) {
        updateFields.push("title = ?");
        updateValues.push(title);
      }
      if (category_id) {
        updateFields.push("category_id = ?");
        updateValues.push(category_id);
      }
      if (teacher_id) {
        updateFields.push("teacher_id = ?");
        updateValues.push(teacher_id);
      }
      if (price !== undefined) {
        updateFields.push("price = ?");
        updateValues.push(price);
      }
      if (price_unit) {
        updateFields.push("price_unit = ?");
        updateValues.push(price_unit);
      }
      if (duration) {
        updateFields.push("duration = ?");
        updateValues.push(duration);
      }
      if (schedule) {
        updateFields.push("schedule = ?");
        updateValues.push(schedule);
      }
      if (age_group) {
        updateFields.push("age_group = ?");
        updateValues.push(age_group);
      }
      if (description) {
        updateFields.push("description = ?");
        updateValues.push(description);
      }
      if (features) {
        let featuresArray = [];
        try {
          featuresArray =
            typeof features === "string" ? JSON.parse(features) : features;
        } catch (e) {
          featuresArray = features.split(",").map((f) => f.trim());
        }
        updateFields.push("features = ?");
        updateValues.push(JSON.stringify(featuresArray));
      }
      if (max_students !== undefined) {
        updateFields.push("max_students = ?");
        updateValues.push(max_students);
      }
      if (featured !== undefined) {
        updateFields.push("featured = ?");
        updateValues.push(featured ? 1 : 0);
      }
      if (available !== undefined) {
        updateFields.push("available = ?");
        updateValues.push(available ? 1 : 0);
      }

      // Handle image upload
      if (req.file) {
        updateFields.push("image = ?");
        updateValues.push(`/uploads/${req.file.filename}`);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        });
      }

      updateFields.push("updated_at = CURRENT_TIMESTAMP");
      updateValues.push(id);

      await dbRun(
        `UPDATE lessons SET ${updateFields.join(", ")} WHERE id = ?`,
        updateValues
      );

      // Get updated lesson
      const lesson = await dbGet(
        `
      SELECT 
        l.*,
        c.name as category_name,
        t.name as teacher_name,
        t.title as teacher_title,
        t.avatar as teacher_avatar
      FROM lessons l
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      WHERE l.id = ?
    `,
        [id]
      );

      res.json({
        success: true,
        message: "Lesson updated successfully",
        data: { lesson },
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
    const lesson = await dbGet("SELECT * FROM lessons WHERE id = ?", [id]);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Delete lesson
    await dbRun("DELETE FROM lessons WHERE id = ?", [id]);

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
