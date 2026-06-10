export const roleMiddleware =
  (requiredRole: any) => (req: any, res: any, next: any) => {
    if ( !requiredRole.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden" });
    }
    next();
  };
