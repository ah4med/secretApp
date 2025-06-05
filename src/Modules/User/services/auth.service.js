import userModel from "../../../DB/Models/user.model.js";
import { compareSync, hashSync } from "bcrypt";
import { encryptUtilFunction } from "../../../Utils/encryption.util.js";
import { sendEmailEventEmitter } from "../../../Services/send-email.service.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import blackListTokenModel from "../../../DB/Models/black-list-token.model.js";

//*****************************signup service*********************************//
export const signupService = async (req, res) => {
  // getting data from user input

  const { email, password, confirmPassword, phone } = req.body;

  // check if password and confirm password are same to enhance performance & user experience
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // check if user already exist
  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    return res.status(409).json({ message: "user already exist" });
  }

  const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);
  const encryptedPhone = await encryptUtilFunction({
    value: phone,
    secretKey: process.env.ENCRYPTION_SECRET_KEY,
  });

  // create verify email link
  // using jwt to create token to encrypt email
  const emailToken = jwt.sign({ email }, process.env.JWT_EMAIL_VER); //, {
  //   expiresIn: '40',
  // });

  const verifyEmailLink = `${req.protocol}://${req.headers.host}/auth/verify-email/${emailToken}`;

  // trigger event to send email to user

  sendEmailEventEmitter.emit("sendEmail", {
    to: email,
    subject: "please verify your email",
    html: `<a href=${verifyEmailLink}>please verify your email</a>`,
  });

  // create user if not exist
  const user = await userModel.create({
    email,
    phone: encryptedPhone,
    password: hashedPassword,
  });
  if (!user) {
    return res.status(409).json({ message: "failed to create user" });
  }
  res.status(201).json({ message: "User created successfully", user });
};
//*****************************login service*********************************//
export const loginService = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "please enter valid credentials" }); //don't let the user know which credentials are wrong
    }
    const isPasswordCorrect = compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(404)
        .json({ message: "please enter valid credentials" }); //don't let the user know which credentials are wrong
    }

    // *******create access token and return it with response to be used by front end*********
    const accessToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1d", jwtid: uuidv4() }
    );

    //******create refresh token and return it with response to be used by front end*********
    const refreshToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "2d", jwtid: uuidv4() }
    );

    //**** send response to client****

    res
      .status(200)
      .json({ message: "Login successful", user, accessToken, refreshToken });
  } catch (error) {
    console.log(`Login failed`, error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//*****************************email verification service*********************************//
export const verifyEmailService = async (req, res) => {
  try {
    const { emailToken } = req.params;
    const email = jwt.verify(emailToken, process.env.JWT_EMAIL_VER).email; // to get only email from token
    const user = await userModel.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "Email verified successfully", user });
  } catch (error) {
    console.log(`email verification failed`, error);
    res.status(500).json({ message: "Something went wrong ", error });
  }
};

//*****************************refresh token service*********************************//

export const refreshTokenService = async (req, res) => {
  try {
    const { refreshtoken } = req.headers;
    const decodedToken = jwt.verify(refreshtoken, process.env.JWT_REFRESH_KEY);
    const accessToken = jwt.sign(
      { email: decodedToken.email, _id: decodedToken._id },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1d" }
    );
    res.status(200).json({ message: "refresh token successful", accessToken });
  } catch (error) {
    console.log(`refresh token failed`, error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

//***************************** logout service**********************************/

export const logoutService = async (req, res) => {
  try {
    const { accesstoken, refreshtoken } = req.headers; // tokens are sent in headers && headers keys are all in lowercase
    const decodedToken = jwt.verify(accesstoken, process.env.JWT_ACCESS_KEY);
    const decodedrefreshToken = jwt.verify(
      refreshtoken,
      process.env.JWT_REFRESH_KEY
    );
    // const tokenId = decodedToken.jwtid;
    // const expiresAt = decodedToken.exp;
    const revokedToken = await blackListTokenModel.insertMany([
      {
        tokenId: decodedToken.jti,
        expiresAt: decodedToken.exp,
        userId: decodedToken._id,
      },
      {
        tokenId: decodedrefreshToken.jti,
        expiresAt: decodedrefreshToken.exp,
        userId: decodedrefreshToken._id,
      },
    ]);
    res.status(200).json({ message: "logout successful", revokedToken });
  } catch (error) {
    console.log(`logout failed`, error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

//***************************** forgot password service**********************************/

export const forgotPasswordService = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000); // generate a 6 digit number
    sendEmailEventEmitter.emit("sendEmail", {
      to: user.email,
      subject: "reset password",
      html: `<p>your otp is <b>${otp}</b></p>`,
    });

    // hash the otp then store in the database in the user collection
    const hashedOtp = hashSync(otp.toString(), +process.env.SALT_ROUNDS);
    user.otp = hashedOtp;
    await user.save();
    res.status(200).json({ message: "otp sent to email" });
  } catch (error) {
    console.log(`failed to send otp, ${error.message}`);

    res
      .status(500)
      .json({ message: `failed to reset password, ${error.message}` });
  }
};

//***************************** reset password service**********************************/

export const resetPasswordService = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (!user.otp) {
      return res.status(400).json({ message: "please generate otp first" });
    }
    const isOtpValid = compareSync(otp.toString(), user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "invalid otp" });
    }
    const hashedPassword = hashSync(newPassword, +process.env.SALT_ROUNDS);
    await userModel.updateOne(
      { _id: user._id },
      { password: hashedPassword, $unset: { otp: 1 } }
    ); // $unset means that otp field will be removed from the document});
    res.status(200).json({ message: "password reset successful" });
  } catch (error) {
    console.log(`failed to reset password, ${error.message}`);
    res
      .status(500)
      .json({ message: `failed to reset password, ${error.message}` });
  }
};
