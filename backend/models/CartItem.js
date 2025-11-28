import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lesson_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique combination of user and lesson
cartItemSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });

export default mongoose.model("CartItem", cartItemSchema);

