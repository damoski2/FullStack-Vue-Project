// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let error = {
    success: false,
    message: err.message || "Server Error",
    statusCode: err.statusCode || 500,
  };

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error.message = "Resource not found";
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error.message = "Duplicate field value entered";
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token";
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expired";
    error.statusCode = 401;
  }

  // SQLite errors
  if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    error.message = "Duplicate entry";
    error.statusCode = 400;
  }

  if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
    error.message = "Referenced resource not found";
    error.statusCode = 400;
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 Not Found middleware
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = req.validationErrors;
  if (errors && errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.map((err) => ({
        field: err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};
