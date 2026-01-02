import { Router } from "express";
import {
  login,
  register,
  refreshToken,
  logout,
  getCurrentUser,
  changePassword,
  updateProfile,
  deleteAccount,
} from "../../controllers/authController";
import { validate } from "../../middlewares/validateResponseMiddleware";
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  updateProfileSchema,
  deleteAccountSchema,
} from "../../validators/authValidator";
import { authenticate } from "../../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/refresh-token", refreshToken);

authRouter.post("/logout", authenticate, logout);
authRouter.get("/me", authenticate, getCurrentUser);
authRouter.put(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePassword
);
authRouter.put(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  updateProfile
);
authRouter.delete(
  "/account",
  authenticate,
  validate(deleteAccountSchema),
  deleteAccount
);

export default authRouter;
