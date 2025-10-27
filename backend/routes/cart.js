import express from "express";
import { body, validationResult } from "express-validator";
import { dbQuery, dbGet, dbRun } from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart items
// @access  Private
router.get("/", authenticateToken, async (req, res) => {
  try {
    const cartItems = await dbQuery(
      `
      SELECT 
        ci.*,
        l.title,
        l.price,
        l.price_unit,
        l.duration,
        l.schedule,
        l.age_group,
        l.image,
        l.description,
        c.name as category_name,
        t.name as teacher_name,
        t.title as teacher_title,
        t.avatar as teacher_avatar
      FROM cart_items ci
      LEFT JOIN lessons l ON ci.lesson_id = l.id
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `,
      [req.user.id]
    );

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    res.json({
      success: true,
      data: {
        items: cartItems,
        summary: {
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
          itemCount: cartItems.reduce(
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
    body("lesson_id").isInt().withMessage("Lesson ID must be a valid integer"),
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
      const lesson = await dbGet(
        `
      SELECT id, title, price, available, max_students, students_enrolled
      FROM lessons 
      WHERE id = ? AND available = 1
    `,
        [lesson_id]
      );

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
      const existingItem = await dbGet(
        "SELECT * FROM cart_items WHERE user_id = ? AND lesson_id = ?",
        [req.user.id, lesson_id]
      );

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

        await dbRun(
          "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND lesson_id = ?",
          [newQuantity, req.user.id, lesson_id]
        );

        res.json({
          success: true,
          message: `Updated quantity for ${lesson.title}`,
          data: { quantity: newQuantity },
        });
      } else {
        // Add new item to cart
        await dbRun(
          "INSERT INTO cart_items (user_id, lesson_id, quantity) VALUES (?, ?, ?)",
          [req.user.id, lesson_id, quantity]
        );

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
    body("lesson_id").isInt().withMessage("Lesson ID must be a valid integer"),
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
      const lesson = await dbGet(
        `
      SELECT id, title, available, max_students, students_enrolled
      FROM lessons 
      WHERE id = ? AND available = 1
    `,
        [lesson_id]
      );

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
      const existingItem = await dbGet(
        "SELECT * FROM cart_items WHERE user_id = ? AND lesson_id = ?",
        [req.user.id, lesson_id]
      );

      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: "Item not found in cart",
        });
      }

      // Update quantity
      await dbRun(
        "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND lesson_id = ?",
        [quantity, req.user.id, lesson_id]
      );

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
  [body("lesson_id").isInt().withMessage("Lesson ID must be a valid integer")],
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
      const existingItem = await dbGet(
        "SELECT ci.*, l.title FROM cart_items ci LEFT JOIN lessons l ON ci.lesson_id = l.id WHERE ci.user_id = ? AND ci.lesson_id = ?",
        [req.user.id, lesson_id]
      );

      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: "Item not found in cart",
        });
      }

      // Remove item from cart
      await dbRun(
        "DELETE FROM cart_items WHERE user_id = ? AND lesson_id = ?",
        [req.user.id, lesson_id]
      );

      res.json({
        success: true,
        message: `${existingItem.title} removed from cart`,
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
    await dbRun("DELETE FROM cart_items WHERE user_id = ?", [req.user.id]);

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
    const result = await dbGet(
      "SELECT SUM(quantity) as count FROM cart_items WHERE user_id = ?",
      [req.user.id]
    );

    const count = result.count || 0;

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
