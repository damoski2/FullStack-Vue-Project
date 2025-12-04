import express from "express";
import { body, validationResult } from "express-validator";
import CartItem from "../models/CartItem.js";
import Lesson from "../models/Lesson.js";
import Category from "../models/Category.js";
import Teacher from "../models/Teacher.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart items
// @access  Private
router.get("/", authenticateToken, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user_id: req.user.id })
      .populate({
        path: "lesson_id",
        populate: [
          { path: "category_id", select: "name" },
          { path: "teacher_id", select: "name title avatar" },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    // Transform cart items
    const transformedItems = cartItems.map((item) => ({
      id: item._id.toString(),
      user_id: item.user_id.toString(),
      lesson_id: item.lesson_id?._id.toString(),
      quantity: item.quantity,
      title: item.lesson_id?.title,
      price: item.lesson_id?.price,
      price_unit: item.lesson_id?.price_unit,
      duration: item.lesson_id?.duration,
      schedule: item.lesson_id?.schedule,
      age_group: item.lesson_id?.age_group,
      image: item.lesson_id?.image,
      description: item.lesson_id?.description,
      category_name: item.lesson_id?.category_id?.name,
      teacher_name: item.lesson_id?.teacher_id?.name,
      teacher_title: item.lesson_id?.teacher_id?.title,
      teacher_avatar: item.lesson_id?.teacher_id?.avatar,
      created_at: item.createdAt,
    }));

    // Calculate totals
    const subtotal = transformedItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    res.json({
      success: true,
      data: {
        items: transformedItems,
        summary: {
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
          itemCount: transformedItems.reduce(
            (count, item) => count + item.quantity,
            0
          ),
        },
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching cart",
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post(
  "/add",
  authenticateToken,
  [
    body("lesson_id")
      .notEmpty()
      .withMessage("Lesson ID is required")
      .matches(/^[0-9a-fA-F]{24}$/)
      .withMessage("Lesson ID must be a valid MongoDB ObjectId"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
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

      const { lesson_id, quantity = 1 } = req.body;

      // Check if lesson exists and is available
      const lesson = await Lesson.findOne({
        _id: lesson_id,
        available: true,
      }).select("title price available max_students students_enrolled");

      if (!lesson) {
        return res.status(404).json({
          success: false,
          message: "Lesson not found or not available",
        });
      }

      // Check if there's space for enrollment
      if (lesson.students_enrolled + quantity > lesson.max_students) {
        return res.status(400).json({
          success: false,
          message: `Only ${
            lesson.max_students - lesson.students_enrolled
          } spots available`,
        });
      }

      // Check if item already exists in cart
      const existingItem = await CartItem.findOne({
        user_id: req.user.id,
        lesson_id: lesson_id,
      });

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;

        // Check space again with new quantity
        if (lesson.students_enrolled + newQuantity > lesson.max_students) {
          return res.status(400).json({
            success: false,
            message: `Cannot add ${quantity} more. Only ${
              lesson.max_students - lesson.students_enrolled
            } spots available`,
          });
        }

        existingItem.quantity = newQuantity;
        await existingItem.save();

        res.json({
          success: true,
          message: `Updated quantity for ${lesson.title}`,
          data: { quantity: newQuantity },
        });
      } else {
        // Add new item to cart
        await CartItem.create({
          user_id: req.user.id,
          lesson_id: lesson_id,
          quantity,
        });

        res.status(201).json({
          success: true,
          message: `${lesson.title} added to cart`,
          data: { quantity },
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while adding to cart",
      });
    }
  }
);

// @route   PUT /api/cart/update
// @desc    Update cart item quantity
// @access  Private
router.put(
  "/update",
  authenticateToken,
  [
    body("lesson_id")
      .notEmpty()
      .withMessage("Lesson ID is required")
      .matches(/^[0-9a-fA-F]{24}$/)
      .withMessage("Lesson ID must be a valid MongoDB ObjectId"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
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

      const { lesson_id, quantity } = req.body;

      // Check if lesson exists and is available
      const lesson = await Lesson.findOne({
        _id: lesson_id,
        available: true,
      }).select("title available max_students students_enrolled");

      if (!lesson) {
        return res.status(404).json({
          success: false,
          message: "Lesson not found or not available",
        });
      }

      // Check if there's space for enrollment
      if (lesson.students_enrolled + quantity > lesson.max_students) {
        return res.status(400).json({
          success: false,
          message: `Only ${
            lesson.max_students - lesson.students_enrolled
          } spots available`,
        });
      }

      // Check if item exists in cart
      const existingItem = await CartItem.findOne({
        user_id: req.user.id,
        lesson_id: lesson_id,
      });

      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: "Item not found in cart",
        });
      }

      // Update quantity
      existingItem.quantity = quantity;
      await existingItem.save();

      res.json({
        success: true,
        message: `Updated quantity for ${lesson.title}`,
        data: { quantity },
      });
    } catch (error) {
      console.error("Update cart error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating cart",
      });
    }
  }
);

// @route   DELETE /api/cart/remove
// @desc    Remove item from cart
// @access  Private
router.delete(
  "/remove",
  authenticateToken,
  [
    body("lesson_id")
      .notEmpty()
      .withMessage("Lesson ID is required")
      .matches(/^[0-9a-fA-F]{24}$/)
      .withMessage("Lesson ID must be a valid MongoDB ObjectId"),
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

      const { lesson_id } = req.body;

      // Check if item exists in cart
      const existingItem = await CartItem.findOne({
        user_id: req.user.id,
        lesson_id: lesson_id,
      }).populate("lesson_id", "title");

      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: "Item not found in cart",
        });
      }

      const title = existingItem.lesson_id?.title || "Item";

      // Remove item from cart
      await CartItem.deleteOne({
        user_id: req.user.id,
        lesson_id: lesson_id,
      });

      res.json({
        success: true,
        message: `${title} removed from cart`,
      });
    } catch (error) {
      console.error("Remove from cart error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while removing from cart",
      });
    }
  }
);

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete("/clear", authenticateToken, async (req, res) => {
  try {
    await CartItem.deleteMany({ user_id: req.user.id });

    res.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while clearing cart",
    });
  }
});

// @route   GET /api/cart/count
// @desc    Get cart item count
// @access  Private
router.get("/count", authenticateToken, async (req, res) => {
  try {
    const items = await CartItem.find({ user_id: req.user.id });
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error("Get cart count error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting cart count",
    });
  }
});

export default router;
