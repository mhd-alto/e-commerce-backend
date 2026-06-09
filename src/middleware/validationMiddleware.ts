const AppErrorMod = require("../utils/AppError");
const AppError = AppErrorMod?.AppError ?? AppErrorMod?.default ?? AppErrorMod;

function validationMiddleware(validateFn: any) {
  return (req: any, res: any, next: any) => {
    try {
      const errors = validateFn(req);
      if (errors && errors.length) {
        return next(new AppError("Validation failed", 400, errors));
      }
      return next();
    } catch (e) {
      return next(e);
    }
  };
}

module.exports = { validationMiddleware };

export { validationMiddleware };
