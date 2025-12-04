import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    price_unit: {
      type: String,
      required: true,
      enum: ["hour", "session", "month"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      required: true,
    },
    schedule: {
      type: String,
      required: true,
    },
    age_group: {
      type: String,
      required: true,
    },
    students_enrolled: {
      type: Number,
      default: 0,
    },
    max_students: {
      type: Number,
      default: 20,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
lessonSchema.index({ category_id: 1 });
lessonSchema.index({ teacher_id: 1 });
lessonSchema.index({ featured: 1 });
lessonSchema.index({ available: 1 });

export default mongoose.model("Lesson", lessonSchema);
