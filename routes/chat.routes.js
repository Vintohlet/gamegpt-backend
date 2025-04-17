import e from "express";
import ChatController from "../controllers/chat.controller.js"
import {authUser} from "../middleware/auth.middleware.js"
const router = e.Router();

router.post("/", authUser, ChatController.createChat)
router.get("/",authUser, ChatController.getUserChats)
router.get("/:id", authUser, ChatController.getChatById)
router.delete("/:id", authUser, ChatController.deleteChatById)

export default router
