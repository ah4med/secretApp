import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    body: { type: String, required: true },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const messagesModel =
  mongoose.models.messages || mongoose.model("messages", messageSchema);

export default messagesModel;
