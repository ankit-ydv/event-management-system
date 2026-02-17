// Ensure the user is authenticated as a specific role
const requireRole = (role) => (req, res, next) => {
  if (req.session.user && req.session.user.role === role) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized. Please log in.' });
};

const requireAdmin  = requireRole('admin');
const requireVendor = requireRole('vendor');
const requireUser   = requireRole('user');

module.exports = { requireAdmin, requireVendor, requireUser };
