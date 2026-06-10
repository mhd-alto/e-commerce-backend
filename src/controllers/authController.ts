import { AuthService } from "../services/authService";

const authService = new AuthService();

export default class AuthController {
  registerUser = async (req: any, res: any) => {
    const userRegistered = await authService.register(req.body);

    return res.status(201).json({
      ...userRegistered,
      message: "user registered successfully",
    });
  };

  registerAdmin = async (req: any, res: any) => {
    const userRegistered = await authService.addAdmin(req.body);

    return res.status(201).json({
      ...userRegistered,
      message: "admin added successfully",
    });
  };

  login = async (req: any, res: any) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  };
}