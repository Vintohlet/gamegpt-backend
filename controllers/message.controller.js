import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";
import { sendToLLM } from "../services/llmService.js";

class MessageController {
    async sendMessage(req, res) {
        try {
            const { chatId, userMessage } = req.body;  
            const userId = req.userId;
            const chat = await Chat.findById(chatId);
            if (!chat) return res.status(404).json({ message: "Чат не найден" });
            if (chat.user.toString() !== userId) {
                return res.status(403).json({ message: "У вас нет доступа к этому чату" });
            }
            const userMsg = await Message.create({
                chat: chatId,
                sender: "user",
                text: userMessage,
            });
            chat.messages.push({
                sender: "user",
                text: userMessage,
                timestamp: userMsg.timestamp,
            });
            await chat.save();

            const messagesForContext = chat.messages.map((msg) => ({
                sender: msg.sender,
                text: msg.text,
            }));
            
            const llmResponse = await sendToLLM(messagesForContext);
            const assistantMsg = await Message.create({
                chat: chatId,
                sender: "assistant",
                text: llmResponse,
            });

            chat.messages.push({
                sender: "assistant",
                text: llmResponse,
                timestamp: assistantMsg.timestamp,
            });
            await chat.save();
    
            res.status(200).json({ assistantMessage: llmResponse });
        } catch (error) {
            res.status(500).json({ message: "Ошибка при отправке", error: error.message });
        }
    }
    
    async deleteMessage(req,res){
        try {
            const { messageId} = req.body;  
            const message = await Message.findByIdAndDelete({
                messageId
            })
            if(!message){
              res.status(404).json({message:"Сообщение не найдено!"})  
            }
        } catch (error) {
            res.status(500).json({ message: "Ошибка при удалении", error: error.message });
        }
    }
}

export default new MessageController();