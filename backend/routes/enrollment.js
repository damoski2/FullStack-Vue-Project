import express from "express";
import { body, validationResult } from "express-validator";
import Order from "../models/Order.js";
import CartItem from "../models/CartItem.js";
import Lesson from "../models/Lesson.js";
import Category from "../models/Category.js";
import Teacher from "../models/Teacher.js";
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
    body("phone_number")
      .trim()
      .isLength({ min: 10 })
      .withMessage(
        "Phone number is required and must be at least 10 characters"
      ),
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
        phone_number,
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
      const cartItems = await CartItem.find({ user_id: req.user.id })
        .populate(
          "lesson_id",
          "title price price_unit max_students students_enrolled available"
        )
        .lean();

      if (cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty",
        });
      }

      // Filter out items with missing lessons first
      const validCartItems = cartItems.filter((item) => item.lesson_id != null);

      if (validCartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "Cart contains invalid items. Please remove them and try again.",
        });
      }

      // Validate all cart items
      for (const item of validCartItems) {
        const lesson = item.lesson_id;
        if (!lesson) {
          return res.status(400).json({
            success: false,
            message: "One or more lessons not found",
          });
        }

        if (!lesson.available) {
          return res.status(400).json({
            success: false,
            message: `${lesson.title} is no longer available`,
          });
        }

        if (lesson.students_enrolled + item.quantity > lesson.max_students) {
          return res.status(400).json({
            success: false,
            message: `Not enough spots available for ${lesson.title}`,
          });
        }
      }

      // Calculate totals
      const subtotal = validCartItems.reduce((total, item) => {
        const price = item.lesson_id?.price || 0;
        const quantity = item.quantity || 0;
        return total + price * quantity;
      }, 0);

      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;

      // Generate payment ID
      const payment_id = uuidv4();

      // Process enrollments
      const enrollments = [];

      for (const item of validCartItems) {
        const lesson = item.lesson_id;
        // Create order record
        const order = await Order.create({
          user_id: req.user.id,
          lesson_id: lesson._id,
          student_name,
          phone_number,
          student_age,
          student_grade,
          special_notes,
          quantity: item.quantity,
          total_amount: lesson.price * item.quantity,
          payment_method,
          payment_id,
        });

        // Update lesson enrollment count
        await Lesson.findByIdAndUpdate(lesson._id, {
          $inc: { students_enrolled: item.quantity },
        });

        enrollments.push({
          id: order._id.toString(),
          lesson_id: lesson._id.toString(),
          title: lesson.title,
          quantity: item.quantity,
          amount: lesson.price * item.quantity,
        });
      }

      // Clear cart after successful enrollment
      await CartItem.deleteMany({ user_id: req.user.id });

      // In a real application, you would process payment here
      // For demo purposes, we'll mark as paid
      await Order.updateMany(
        { payment_id },
        { payment_status: "paid", status: "confirmed" }
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

    const filter = { user_id: req.user.id };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const enrollments = await Order.find(filter)
      .populate({
        path: "lesson_id",
        populate: [
          { path: "category_id", select: "name" },
          { path: "teacher_id", select: "name title avatar" },
        ],
      })
      .sort({ enrolled_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
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

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        enrollments: transformedEnrollments,
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

    const enrollment = await Order.findOne({
      _id: id,
      user_id: req.user.id,
    })
      .populate({
        path: "lesson_id",
        populate: [
          { path: "category_id", select: "name" },
          { path: "teacher_id", select: "name title avatar phone email" },
        ],
      })
      .lean();

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    const transformedEnrollment = {
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
      price: enrollment.lesson_id?.price,
      price_unit: enrollment.lesson_id?.price_unit,
      category_name: enrollment.lesson_id?.category_id?.name,
      teacher_name: enrollment.lesson_id?.teacher_id?.name,
      teacher_title: enrollment.lesson_id?.teacher_id?.title,
      teacher_avatar: enrollment.lesson_id?.teacher_id?.avatar,
      teacher_phone: enrollment.lesson_id?.teacher_id?.phone,
      teacher_email: enrollment.lesson_id?.teacher_id?.email,
      enrolled_at: enrollment.enrolled_at || enrollment.createdAt,
    };

    res.json({
      success: true,
      data: { enrollment: transformedEnrollment },
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

      // Check if order exists and belongs to user
      const enrollment = await Order.findOne({
        _id: id,
        user_id: req.user.id,
      });

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
      enrollment.status = "cancelled";
      enrollment.special_notes = reason || "Cancelled by user";
      await enrollment.save();

      // Update lesson enrollment count
      await Lesson.findByIdAndUpdate(enrollment.lesson_id, {
        $inc: { students_enrolled: -enrollment.quantity },
      });

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
    const enrollments = await Order.find({ user_id: req.user.id });

    const summary = {
      total_enrollments: enrollments.length,
      confirmed_enrollments: enrollments.filter((e) => e.status === "confirmed")
        .length,
      pending_enrollments: enrollments.filter((e) => e.status === "pending")
        .length,
      cancelled_enrollments: enrollments.filter((e) => e.status === "cancelled")
        .length,
      completed_enrollments: enrollments.filter((e) => e.status === "completed")
        .length,
      total_spent: enrollments.reduce(
        (sum, e) => sum + (e.total_amount || 0),
        0
      ),
    };

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
