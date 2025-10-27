import express from "express";
import { body, validationResult } from "express-validator";
import { dbQuery, dbGet, dbRun } from "../config/database.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await dbGet(
      `
      SELECT 
        id, name, email, role, phone, address, city, state, zip, 
        created_at, updated_at
      FROM users 
      WHERE id = ?
    `,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: { user },
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
    const enrollments = await dbQuery(
      `
      SELECT 
        e.*,
        l.title,
        l.description,
        l.image,
        l.duration,
        l.schedule,
        l.age_group,
        c.name as category_name,
        t.name as teacher_name,
        t.title as teacher_title,
        t.avatar as teacher_avatar
      FROM enrollments e
      LEFT JOIN lessons l ON e.lesson_id = l.id
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `,
      [req.user.id]
    );

    res.json({
      success: true,
      data: { enrollments },
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
    const reviews = await dbQuery(
      `
      SELECT 
        r.*,
        l.title,
        l.image,
        c.name as category_name
      FROM reviews r
      LEFT JOIN lessons l ON r.lesson_id = l.id
      LEFT JOIN categories c ON l.category_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `,
      [req.user.id]
    );

    res.json({
      success: true,
      data: { reviews },
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
    body("lesson_id").isInt().withMessage("Lesson ID must be a valid integer"),
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
      const enrollment = await dbGet(
        'SELECT id FROM enrollments WHERE user_id = ? AND lesson_id = ? AND status IN ("confirmed", "completed")',
        [req.user.id, lesson_id]
      );

      if (!enrollment) {
        return res.status(400).json({
          success: false,
          message: "You must be enrolled in this lesson to review it",
        });
      }

      // Check if user already reviewed this lesson
      const existingReview = await dbGet(
        "SELECT id FROM reviews WHERE user_id = ? AND lesson_id = ?",
        [req.user.id, lesson_id]
      );

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed this lesson",
        });
      }

      // Create review
      const result = await dbRun(
        "INSERT INTO reviews (user_id, lesson_id, rating, comment) VALUES (?, ?, ?, ?)",
        [req.user.id, lesson_id, rating, comment]
      );

      // Update lesson rating
      const lessonReviews = await dbQuery(
        "SELECT rating FROM reviews WHERE lesson_id = ?",
        [lesson_id]
      );

      const averageRating =
        lessonReviews.reduce((sum, review) => sum + review.rating, 0) /
        lessonReviews.length;

      await dbRun("UPDATE lessons SET rating = ?, reviews = ? WHERE id = ?", [
        averageRating,
        lessonReviews.length,
        lesson_id,
      ]);

      // Get the created review
      const review = await dbGet("SELECT * FROM reviews WHERE id = ?", [
        result.id,
      ]);

      res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: { review },
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
    const stats = await dbGet(
      `
      SELECT 
        (SELECT COUNT(*) FROM enrollments WHERE user_id = ?) as total_enrollments,
        (SELECT COUNT(*) FROM enrollments WHERE user_id = ? AND status = 'confirmed') as active_enrollments,
        (SELECT COUNT(*) FROM reviews WHERE user_id = ?) as total_reviews,
        (SELECT SUM(total_amount) FROM enrollments WHERE user_id = ? AND payment_status = 'paid') as total_spent
    `,
      [req.user.id, req.user.id, req.user.id, req.user.id]
    );

    // Get recent enrollments
    const recentEnrollments = await dbQuery(
      `
      SELECT 
        e.*,
        l.title,
        l.image,
        c.name as category_name
      FROM enrollments e
      LEFT JOIN lessons l ON e.lesson_id = l.id
      LEFT JOIN categories c ON l.category_id = c.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
      LIMIT 5
    `,
      [req.user.id]
    );

    // Get upcoming lessons (if any)
    const upcomingLessons = await dbQuery(
      `
      SELECT 
        l.*,
        c.name as category_name,
        t.name as teacher_name
      FROM enrollments e
      LEFT JOIN lessons l ON e.lesson_id = l.id
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      WHERE e.user_id = ? AND e.status = 'confirmed'
      ORDER BY e.enrolled_at ASC
      LIMIT 5
    `,
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        stats,
        recentEnrollments,
        upcomingLessons,
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

    let sql = `
      SELECT 
        id, name, email, role, phone, address, city, state, zip,
        created_at, updated_at
      FROM users 
      WHERE 1=1
    `;

    const params = [];

    if (role) {
      sql += " AND role = ?";
      params.push(role);
    }

    if (search) {
      sql += " AND (name LIKE ? OR email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY created_at DESC";

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    sql += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    const users = await dbQuery(sql, params);

    // Get total count
    let countSql = "SELECT COUNT(*) as total FROM users WHERE 1=1";
    const countParams = [];

    if (role) {
      countSql += " AND role = ?";
      countParams.push(role);
    }

    if (search) {
      countSql += " AND (name LIKE ? OR email LIKE ?)";
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const countResult = await dbGet(countSql, countParams);
    const total = countResult.total;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        users,
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

export default router;
