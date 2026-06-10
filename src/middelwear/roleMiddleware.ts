export const roleMiddleware =
  (requiredRole: any) => (req: any, res: any, next: any) => {
    if (req.user?.role !== requiredRole)
      return res.status(403).json({ message: "Access forbidden" });
    next();
  };
