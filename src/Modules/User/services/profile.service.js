import { compareSync, hashSync } from "bcrypt";
import blackListTokenModel from "../../../DB/Models/black-list-token.model.js";
import userModel from "../../../DB/Models/user.model.js";
import {
  decryptUtilFunction,
  encryptUtilFunction,
} from "../../../Utils/encryption.util.js";
import jwt from "jsonwebtoken";
import { sendEmailEventEmitter } from "../../../Services/send-email.service.js";

//*********list all users service **********/
export const listUsersService = async (req, res) => {
  const users = await userModel.find({}, { password: 0, __v: 0 });
  // .toArray(); // to convert from Bson to Json if using mongodb native driver
  res.status(200).json({ message: "Users fetched successfully", users });
};

//*********get user data service **********/

export const getUserData = async (req, res) => {
  const { _id } = req.authenticatedUser; // tokens are sent in headers && headers keys are all in lowercase
  const user = await userModel.findById(_id, "_id email phone");
  user.phone = await decryptUtilFunction({
    cipher: user.phone,
    secretKey: process.env.ENCRYPTION_SECRET_KEY,
  });
  return res.status(200).json({ message: "User fetched successfully", user });
};

//*********update password service **********/
export const updatePasswordService = async (req, res) => {
  const { _id } = req.authenticatedUser;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  const user = await userModel.findById(_id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const isPasswordValid = compareSync(currentPassword, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const hashedPassword = hashSync(newPassword, +process.env.SALT_ROUNDS);

  user.password = hashedPassword;
  await user.save();

  // revoke token
  await blackListTokenModel.insertOne({
    tokenId: req.authenticatedUser.token.tokenId,
    expiresAt: req.authenticatedUser.token.expiresAt,
    userId: _id,
  });

  //      tokenId: decodedToken.jti,
  //     expiresAt: decodedToken.exp,
  //     userId: decodedToken._id,

  res.status(200).json({ message: "Password updated successfully" });
};

//*********update profile service **********/

export const updateProfileService = async (req, res) => {
  const { _id } = req.authenticatedUser;
  const { email, phone } = req.body;
  const user = await userModel.findById(_id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  // if phone is not empty
  if (phone) {
    // encrypt new number & save it to db
    user.phone = await encryptUtilFunction({
      value: phone,
      secretKey: process.env.ENCRYPTION_SECRET_KEY,
    });
    await user.save();
  }

  // if email is not empty, check if it exists in the database
  if (email) {
    if (await userModel.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // if email not in database, save the updated user
    // 1- update email
    // 2- set isVerified to false
    // 3- send email verification link to new email
    await user.updateOne(
      { email },
      {
        $set: {
          isVerified: false,
        },
      }
    );

    // using jwt to create token to encrypt email
    const emailToken = jwt.sign({ email }, process.env.JWT_EMAIL_VER);

    // create verify email link
    const verifyEmailLink = `${req.protocol}://${req.headers.host}/user/verify-email/${emailToken}`;

    // trigger event to send email to user
    sendEmailEventEmitter.emit("sendEmail", {
      to: email,
      subject: "please verify your email",
      html: `<a href=${verifyEmailLink}>please verify your email</a>`,
    });
  }
  res.status(200).json({ message: "Profile updated successfully" });
};
