import { errorHandler } from "../../Middleware/error-handler-middleware.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";
import { singUpSchema } from "../../validators/auth.schema.js";
import * as authService from "../User/services/auth.service.js";
import { Router } from "express";
const authRouter = Router();

// signup
authRouter.post(
  "/signup",
  validationMiddleware(singUpSchema),
  errorHandler(authService.signupService)
);

// login
authRouter.post("/login", errorHandler(authService.loginService));

// verify email
authRouter.get("/verify-email/:emailToken", authService.verifyEmailService);

// refresh token
authRouter.post("/refresh-token", authService.refreshTokenService);

// logout
authRouter.post("/logout", authService.logoutService);

// forgot password
authRouter.patch("/forgot-password", authService.forgotPasswordService);

// reset password
authRouter.put("/reset-password", authService.resetPasswordService);

export { authRouter };
