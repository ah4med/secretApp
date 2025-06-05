import { Router } from "express";
import { errorHandler } from "../../Middleware/error-handler-middleware.js";
import * as messageService from "./Services/message.service.js";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";

const messageController = Router();

messageController.use(errorHandler(authenticationMiddleware()));

// send message
messageController.post(
  "/send-message",
  errorHandler(messageService.sendMessageService)
);

// get messages
messageController.get(
  "/get-inbox",
  errorHandler(messageService.receivedMessagesService)
);

// get sent messages
messageController.get(
  "/get-sent",
  errorHandler(messageService.sentMessagesService)
);

export { messageController };
