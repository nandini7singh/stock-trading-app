/**
 * Role-Based Access Control (RBAC) Middleware
 * Supports: admin, moderator, user, guest
 */

const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
  GUEST: "guest",
};

// Role hierarchy: higher index = more permissions
const ROLE_HIERARCHY = [ROLES.GUEST, ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN];

/**
 * Check if a role meets the minimum required role level
 * @param {string} userRole - The role of the current user
 * @param {string} requiredRole - The minimum required role
 * @returns {boolean}
 */
const hasMinimumRole = (userRole, requiredRole) => {
  const userLevel = ROLE_HIERARCHY.indexOf(userRole);
  const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
  return userLevel >= requiredLevel;
};

/**
 * Middleware: Require a specific role (exact match or higher in hierarchy)
 * @param {...string} roles - One or more allowed roles
 * @returns {Function} Express middleware
 *
 * @example
 * router.get('/dashboard', requireRole('admin'), handler)
 * router.get('/reports', requireRole('admin', 'moderator'), handler)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required. Please log in.",
      });
    }

    const userRole = user.role;

    if (!userRole) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "User role not defined.",
      });
    }

    const hasAccess = roles.some((role) => userRole === role);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: `Access denied. Required role(s): ${roles.join(", ")}. Your role: ${userRole}`,
      });
    }

    next();
  };
};

/**
 * Middleware: Require admin role specifically
 * Shorthand for requireRole('admin')
 *
 * @example
 * router.delete('/users/:id', isAdmin, handler)
 */
const isAdmin = requireRole(ROLES.ADMIN);

/**
 * Middleware: Require at least a minimum role level (hierarchy-aware)
 * @param {string} minimumRole - Minimum role required
 * @returns {Function} Express middleware
 *
 * @example
 * router.get('/content', requireMinRole('moderator'), handler) // allows moderator + admin
 */
const requireMinRole = (minimumRole) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required. Please log in.",
      });
    }

    if (!ROLE_HIERARCHY.includes(minimumRole)) {
      return res.status(500).json({
        success: false,
        error: "Server Error",
        message: `Invalid role configuration: "${minimumRole}"`,
      });
    }

    if (!hasMinimumRole(user.role, minimumRole)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: `Insufficient permissions. Minimum required: ${minimumRole}. Your role: ${user.role}`,
      });
    }

    next();
  };
};

/**
 * Middleware: Allow access only to the resource owner OR an admin
 * Useful for routes like GET /users/:id where users can only access their own data
 * @param {Function} getResourceOwnerId - Function to extract the owner's ID from req
 * @returns {Function} Express middleware
 *
 * @example
 * router.get('/users/:id', ownerOrAdmin((req) => req.params.id), handler)
 */
const ownerOrAdmin = (getResourceOwnerId) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required.",
      });
    }

    if (user.role === ROLES.ADMIN) {
      return next(); // Admins can access everything
    }

    const ownerId = getResourceOwnerId(req);
    const userId = String(user.id || user._id);

    if (String(ownerId) !== userId) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You can only access your own resources.",
      });
    }

    next();
  };
};

/**
 * Middleware: Attach role info to response locals for use in views/downstream middleware
 *
 * @example
 * app.use(attachRoleInfo)
 */
const attachRoleInfo = (req, res, next) => {
  if (req.user) {
    res.locals.userRole = req.user.role;
    res.locals.isAdmin = req.user.role === ROLES.ADMIN;
    res.locals.isModerator = [ROLES.ADMIN, ROLES.MODERATOR].includes(req.user.role);
  }
  next();
};

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
  hasMinimumRole,
  requireRole,
  isAdmin,
  requireMinRole,
  ownerOrAdmin,
  attachRoleInfo,
};