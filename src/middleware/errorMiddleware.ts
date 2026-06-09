const AppErrorMod = require("../utils/AppError");
const AppError =
  AppErrorMod?.AppError ?? AppErrorMod?.default ?? AppErrorMod;

function errorMiddleware(err: any, req: any, res: any, next: any) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
}

module.exports = { errorMiddleware };

export { errorMiddleware };
