import { AuthService } from "../services/authService";

const authService = new AuthService();

export default class AuthController {
  login = async (req: any, res: any) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  };
}
