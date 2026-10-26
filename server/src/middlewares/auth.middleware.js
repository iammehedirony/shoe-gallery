const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(ApiError.unauthorized("Authentication token is required"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return next(ApiError.unauthorized("User account not found or deactivated"));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Token has expired. Please log in again."));
    }
    return next(ApiError.unauthorized("Invalid authentication token"));
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true, isActive: true },
      });
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // If token invalid, proceed as guest
    next();
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return next(ApiError.forbidden("Access denied. Admin privileges required."));
  }
  next();
};

module.exports = {
  verifyToken,
  optionalAuth,
  requireAdmin,
};
