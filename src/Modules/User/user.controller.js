import { sysytemRoles } from "../../constants/constats.js";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { authorizationMiddleware } from "../../Middleware/authorization.middleware.js";
import { errorHandler } from "../../Middleware/error-handler-middleware.js";
import * as profileService from "./services/profile.service.js";
import { Router } from "express";
// import * as authService from "./services/auth.service.js"; // importing all services as one object

const userController = Router();

const { ADMIN, USER } = sysytemRoles;

userController.use(errorHandler(authenticationMiddleware())); // using authentication middleware for all routes

// list users only admin role is authorized
userController.get(
  "/list-users",
  authorizationMiddleware([USER]),
  errorHandler(profileService.listUsersService)
);

// get user data for logged in user
userController.get("/get-user", errorHandler(profileService.getUserData));
// update password
userController.patch(
  "/update-password",
  errorHandler(profileService.updatePasswordService)
);

// update profile data
userController.put(
  "/update-profile",
  errorHandler(profileService.updateProfileService)
);

// // signup
// userController.post("/signup", authService.signupService);

// // login
// userController.post("/login", authService.loginService);

// verify email
// userController.get("/verify-email/:emailToken", authService.verifyEmailService);

// refresh token
// userController.post("/refresh-token", authService.refreshTokenService);

// logout
// userController.post("/logout", authService.logoutService);

// forgot password
// userController.patch("/forgot-password", authService.forgotPasswordService);

// reset password
// userController.put("/reset-password", authService.resetPasswordService);

export { userController };
