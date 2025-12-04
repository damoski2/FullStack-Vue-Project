import express from "express";
import { body, validationResult } from "express-validator";
import Category from "../models/Category.js";
import Lesson from "../models/Lesson.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get("/", async (req, res) => {
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
      updated_at: cat.updatedAt,
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

// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Get lesson count for this category
    const lessonCount = await Lesson.countDocuments({
      category_id: category._id,
      available: true,
    });

    const categoryData = {
      id: category._id.toString(),
      name: category.name,
      description: category.description,
      icon: category.icon,
      lesson_count: lessonCount,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    };

    res.json({
      success: true,
      data: { category: categoryData },
    });
  } catch (error) {
    console.error("Get category error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching category",
    });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Admin only
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Category name must be at least 2 characters")
      .isLength({ max: 50 })
      .withMessage("Category name must be less than 50 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("icon")
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage("Icon URL must be less than 255 characters"),
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

      const { name, description, icon } = req.body;

      // Check if category with same name already exists
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }

      // Create category
      const category = await Category.create({
        name: name.trim(),
        description: description?.trim() || "",
        icon: icon?.trim() || "",
      });

      const categoryData = {
        id: category._id.toString(),
        name: category.name,
        description: category.description,
        icon: category.icon,
        lesson_count: 0,
        created_at: category.createdAt,
        updated_at: category.updatedAt,
      };

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: { category: categoryData },
      });
    } catch (error) {
      console.error("Create category error:", error);
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
      res.status(500).json({
        success: false,
        message: "Server error while creating category",
      });
    }
  }
);

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Admin only
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Category name must be at least 2 characters")
      .isLength({ max: 50 })
      .withMessage("Category name must be less than 50 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("icon")
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage("Icon URL must be less than 255 characters"),
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

      const { name, description, icon } = req.body;
      const updateData = {};

      // Build update object
      if (name !== undefined) {
        // Check if new name conflicts with existing category
        const existingCategory = await Category.findOne({
          name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
          _id: { $ne: req.params.id },
        });

        if (existingCategory) {
          return res.status(400).json({
            success: false,
            message: "Category with this name already exists",
          });
        }
        updateData.name = name.trim();
      }

      if (description !== undefined) {
        updateData.description = description.trim();
      }

      if (icon !== undefined) {
        updateData.icon = icon.trim();
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        });
      }

      // Update category
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      // Get lesson count
      const lessonCount = await Lesson.countDocuments({
        category_id: category._id,
        available: true,
      });

      const categoryData = {
        id: category._id.toString(),
        name: category.name,
        description: category.description,
        icon: category.icon,
        lesson_count: lessonCount,
        created_at: category.createdAt,
        updated_at: category.updatedAt,
      };

      res.json({
        success: true,
        message: "Category updated successfully",
        data: { category: categoryData },
      });
    } catch (error) {
      console.error("Update category error:", error);
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
      res.status(500).json({
        success: false,
        message: "Server error while updating category",
      });
    }
  }
);

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Admin only
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has associated lessons
    const lessonCount = await Lesson.countDocuments({
      category_id: category._id,
    });

    if (lessonCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${lessonCount} associated lesson(s). Please remove or reassign lessons first.`,
      });
    }

    // Delete category
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while deleting category",
    });
  }
});

export default router;
