const ApiError = require("../utils/apiError");

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Prisma unique constraint violation error handler
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    error = new ApiError(409, `A record with this ${field} already exists.`);
  }

  // Prisma record not found error handler
  if (err.code === "P2025") {
    error = new ApiError(404, "Requested record was not found.");
  }

  // Zod validation error handler
  if (err.name === "ZodError") {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    error = new ApiError(422, "Validation failed", formattedErrors);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
