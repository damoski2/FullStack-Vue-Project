import express from "express";
import { body, validationResult } from "express-validator";
import { dbQuery, dbGet, dbRun } from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// @route   POST /api/enrollments/checkout
// @desc    Process enrollment checkout
// @access  Private
router.post(
  "/checkout",
  authenticateToken,
  [
    // Student information
    body("student_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Student name must be at least 2 characters"),
    body("student_age")
      .isInt({ min: 3, max: 18 })
      .withMessage("Student age must be between 3 and 18"),
    body("student_grade").optional().trim(),
    body("special_notes").optional().trim(),

    // Payment information
    body("payment_method")
      .isIn(["card", "paypal", "bank_transfer"])
      .withMessage("Invalid payment method"),
    body("card_number")
      .optional()
      .isCreditCard()
      .withMessage("Invalid card number"),
    body("card_expiry")
      .optional()
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
      .withMessage("Invalid expiry date (MM/YY)"),
    body("card_cvv")
      .optional()
      .isLength({ min: 3, max: 4 })
      .withMessage("Invalid CVV"),
    body("cardholder_name")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Cardholder name must be at least 2 characters"),
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
        student_name,
        student_age,
        student_grade,
        special_notes,
        payment_method,
        card_number,
        card_expiry,
        card_cvv,
        cardholder_name,
      } = req.body;

      // Get user's cart items
      const cartItems = await dbQuery(
        `
      SELECT 
        ci.*,
        l.title,
        l.price,
        l.price_unit,
        l.max_students,
        l.students_enrolled,
        l.available
      FROM cart_items ci
      LEFT JOIN lessons l ON ci.lesson_id = l.id
      WHERE ci.user_id = ?
    `,
        [req.user.id]
      );

      if (cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty",
        });
      }

      // Validate all cart items
      for (const item of cartItems) {
        if (!item.available) {
          return res.status(400).json({
            success: false,
            message: `${item.title} is no longer available`,
          });
        }

        if (item.students_enrolled + item.quantity > item.max_students) {
          return res.status(400).json({
            success: false,
            message: `Not enough spots available for ${item.title}`,
          });
        }
      }

      // Calculate totals
      const subtotal = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;

      // Generate payment ID
      const payment_id = uuidv4();

      // Process enrollments
      const enrollments = [];

      for (const item of cartItems) {
        // Create enrollment record
        const enrollmentResult = await dbRun(
          `
        INSERT INTO enrollments (
          user_id, lesson_id, student_name, student_age, student_grade,
          special_notes, quantity, total_amount, payment_method, payment_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
          [
            req.user.id,
            item.lesson_id,
            student_name,
            student_age,
            student_grade,
            special_notes,
            item.quantity,
            item.price * item.quantity,
            payment_method,
            payment_id,
          ]
        );

        // Update lesson enrollment count
        await dbRun(
          "UPDATE lessons SET students_enrolled = students_enrolled + ? WHERE id = ?",
          [item.quantity, item.lesson_id]
        );

        enrollments.push({
          id: enrollmentResult.id,
          lesson_id: item.lesson_id,
          title: item.title,
          quantity: item.quantity,
          amount: item.price * item.quantity,
        });
      }

      // Clear cart after successful enrollment
      await dbRun("DELETE FROM cart_items WHERE user_id = ?", [req.user.id]);

      // In a real application, you would process payment here
      // For demo purposes, we'll mark as paid
      await dbRun(
        "UPDATE enrollments SET payment_status = ?, status = ? WHERE payment_id = ?",
        ["paid", "confirmed", payment_id]
      );

      res.status(201).json({
        success: true,
        message: "Enrollment completed successfully",
        data: {
          payment_id,
          enrollments,
          summary: {
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            student_name,
            enrollment_count: enrollments.length,
          },
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during checkout",
      });
    }
  }
);

// @route   GET /api/enrollments
// @desc    Get user's enrollments
// @access  Private
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let sql = `
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
    `;

    const params = [req.user.id];

    if (status) {
      sql += " AND e.status = ?";
      params.push(status);
    }

    sql += " ORDER BY e.enrolled_at DESC";

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    sql += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    const enrollments = await dbQuery(sql, params);

    // Get total count
    let countSql = `
      SELECT COUNT(*) as total
      FROM enrollments e
      WHERE e.user_id = ?
    `;
    const countParams = [req.user.id];

    if (status) {
      countSql += " AND e.status = ?";
      countParams.push(status);
    }

    const countResult = await dbGet(countSql, countParams);
    const total = countResult.total;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        enrollments,
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
    console.error("Get enrollments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching enrollments",
    });
  }
});

// @route   GET /api/enrollments/:id
// @desc    Get single enrollment details
// @access  Private
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await dbGet(
      `
      SELECT 
        e.*,
        l.title,
        l.description,
        l.image,
        l.duration,
        l.schedule,
        l.age_group,
        l.price,
        l.price_unit,
        c.name as category_name,
        t.name as teacher_name,
        t.title as teacher_title,
        t.avatar as teacher_avatar,
        t.phone as teacher_phone,
        t.email as teacher_email
      FROM enrollments e
      LEFT JOIN lessons l ON e.lesson_id = l.id
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      WHERE e.id = ? AND e.user_id = ?
    `,
      [id, req.user.id]
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.json({
      success: true,
      data: { enrollment },
    });
  } catch (error) {
    console.error("Get enrollment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching enrollment",
    });
  }
});

// @route   PUT /api/enrollments/:id/cancel
// @desc    Cancel an enrollment
// @access  Private
router.put(
  "/:id/cancel",
  authenticateToken,
  [body("reason").optional().trim()],
  async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      // Check if enrollment exists and belongs to user
      const enrollment = await dbGet(
        "SELECT * FROM enrollments WHERE id = ? AND user_id = ?",
        [id, req.user.id]
      );

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: "Enrollment not found",
        });
      }

      // Check if enrollment can be cancelled
      if (enrollment.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Enrollment is already cancelled",
        });
      }

      if (enrollment.status === "completed") {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel completed enrollment",
        });
      }

      // Update enrollment status
      await dbRun(
        "UPDATE enrollments SET status = ?, special_notes = ? WHERE id = ?",
        ["cancelled", reason || "Cancelled by user", id]
      );

      // Update lesson enrollment count
      await dbRun(
        "UPDATE lessons SET students_enrolled = students_enrolled - ? WHERE id = ?",
        [enrollment.quantity, enrollment.lesson_id]
      );

      res.json({
        success: true,
        message: "Enrollment cancelled successfully",
      });
    } catch (error) {
      console.error("Cancel enrollment error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while cancelling enrollment",
      });
    }
  }
);

// @route   GET /api/enrollments/summary
// @desc    Get enrollment summary for user
// @access  Private
router.get("/summary", authenticateToken, async (req, res) => {
  try {
    const summary = await dbGet(
      `
      SELECT 
        COUNT(*) as total_enrollments,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_enrollments,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_enrollments,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_enrollments,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_enrollments,
        SUM(total_amount) as total_spent
      FROM enrollments 
      WHERE user_id = ?
    `,
      [req.user.id]
    );

    res.json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    console.error("Get enrollment summary error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching enrollment summary",
    });
  }
});

export default router;
