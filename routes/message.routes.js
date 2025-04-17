import e from "express";
import messageController from "../controllers/message.controller.js"
import {authUser,} from "../middleware/auth.middleware.js"
const router = e.Router();

router.post("/", authUser, messageController.sendMessage)

export default router