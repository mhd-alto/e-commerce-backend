import { Request, Response } from "express";
import ResetPasswordService from "../services/resetPasswordService";

export default class ResetPasswordController {
  private resetPasswordService: ResetPasswordService;

  constructor() {
    this.resetPasswordService = new ResetPasswordService();
  }

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    const result = await this.resetPasswordService.resetPassword(req.body);

    if (!result.success) {
      res.status(500).json({ error: result.error });
      return;
    }

    res.status(200).json(result.data);
  };

  public confirmPassword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.resetPasswordService.confirmPassword(req.body);

    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(200).json(result.data);
  };
}
