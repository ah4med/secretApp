import messagesModel from "../../../DB/Models/messages.model.js";
import userModel from "../../../DB/Models/user.model.js";

export const sendMessageService = async (req, res) => {
  const { body, senderId, receiverId } = req.body;
  // check if receiverId is valid
  const receiver = await userModel.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({ message: "Receiver not found" });
  }
  const newMessage = await messagesModel.create({
    body,
    senderId: req.authenticatedUser._id,
    receiverId,
  });
  return res
    .status(200)
    .json({ message: "Message sent successfully", newMessage });
};

// get receiver messages
export const receivedMessagesService = async (req, res) => {
  const { _id } = req.authenticatedUser;
  const receivedMessages = await messagesModel.find(
    { receiverId: _id },
    { body: 1, createdAt: 1, _id: 0, updatedAt: 1 }
  ); // where receiverId is the authenticated user
  if (!receivedMessages.length) {
    return res.status(404).json({ message: "you don't have any messages" });
  }
  return res
    .status(200)
    .json({ message: "Messages fetched successfully", receivedMessages });
};

// get sent messages
export const sentMessagesService = async (req, res) => {
  const { _id } = req.authenticatedUser;
  const sentMessages = await messagesModel.find(
    { senderId: _id },
    { _id: 0, __v: 0, senderId: 0 }
  ); // where senderId is the authenticated user
  if (!sentMessages.length) {
    return res.status(404).json({ message: "you don't have any messages" });
  }
  return res
    .status(200)
    .json({ message: "Messages fetched successfully", sentMessages });
};
