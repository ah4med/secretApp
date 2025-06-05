export const authorizationMiddleware = (allowedRoles) => {
  // allowed roles => admin, editor, user
  // 1- get the role of the authenticated user
  // 2- compare the role of the authenticated user with the allowed roles
  return async (req, res, next) => {
    try {
      const { role } = req.authenticatedUser;
      // console.log(`current role: ${role}`);

      if (!role || !allowedRoles.includes(role)) {
        return res.status(403).json({ message: "not authorized" });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong/ not authorized",
        error: error.message,
      });
    }
  };
};
