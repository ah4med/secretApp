// import { db } from "../connection.js";

// const userModel = db.collection("users"); // table name
// userModel.createIndex(
//   { email: 1 },
//   { unique: true, name: "email_index_unique" }
// );
// export default userModel;

import mongoose from "mongoose";
import { sysytemRoles } from "../../constants/constats.js";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      index: { name: "email_index_unique", unique: true },
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(sysytemRoles),
      default: sysytemRoles.USER,
    },
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);
// userSchema.index({ email: 1 }, { name: "email_index_unique", unique: true });
const userModel = mongoose.models.users || mongoose.model("users", userSchema);

export default userModel;
