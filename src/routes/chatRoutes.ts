import { Router } from "express";
import { verifyToken } from "../utils/token.js";
import { chatCompletionValidator, validate } from "../utils/validator.js";
import { deleteChats, generateChatCompletion, sendChatsToUser } from "../controllers/chatController.js";

const chatRouter = Router();

chatRouter.post("/user/new", validate(chatCompletionValidator), verifyToken, generateChatCompletion);
chatRouter.get("/allChats", verifyToken, sendChatsToUser);
chatRouter.delete("/delete", verifyToken, deleteChats);

export default chatRouter;