import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
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
    student_name: {
      type: String,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
    },
    student_age: {
      type: Number,
      required: true,
      min: 3,
      max: 18,
    },
    student_grade: {
      type: String,
      trim: true,
    },
    special_notes: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    payment_method: {
      type: String,
      enum: ["card", "paypal", "bank_transfer"],
    },
    payment_id: {
      type: String,
      trim: true,
    },
    enrolled_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user_id: 1 });
orderSchema.index({ lesson_id: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ payment_id: 1 }); // For grouping orders

export default mongoose.model("Order", orderSchema);
