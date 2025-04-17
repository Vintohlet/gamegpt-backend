import { Chat } from "../models/Chat.js";
import { User } from "../models/User.js";

class ChatController{
    async createChat (req, res) {
        try {
          const { chatName } = req.body;
          const userId = req.userId;
          let user = await User.findById(userId)
          if(!user){
            res.status(404).json({message:"Такого пользователя не существует!"})
          }
          const newChat = await new Chat({
            chatName,
            user: userId,
            messages: []
          }).save();
          console.log(newChat)
          await User.findByIdAndUpdate(userId, { 
            $push: { chats: newChat._id } 
          });
          
          res.status(201).json(newChat);
        } catch (error) {
          res.status(500).json({ message: "Ошибка при создании чата", error });
        }
      };
      
      async getUserChats (req, res) {
        try {
          const userId = req.userId;
          const chats = await Chat.find({ user: userId })
            .sort({ updatedAt: -1 });
          
          res.status(200).json(chats);
        } catch (error) {
          res.status(500).json({ message: "Ошибка при получении чатов", error });
        }
      };
      
      
      async getChatById (req, res) {
        try {
          const {id} = req.params;
         
          const chat = await Chat.findById(id);
          if (!chat) {
            return res.status(404).json({ message: "Чат не найден" });
          }
          const userId = req.userId;
          if (chat.user.toString() !== userId) {
            return res.status(403).json({ message: "У вас нет доступа к этому чату" });
        }
          res.status(200).json(chat);
        } catch (error) {
          res.status(500).json({ message: "Ошибка при получении чата", error });
        }
      };
      async deleteChatById (req,res){
        try {
          const userId = req.userId;
          const {id} = req.params;
          const chat = await Chat.findByIdAndDelete(id);
          if (!chat){
            return res.status(404).json({ message: "Чат не найден" });
          }
          if (chat.user.toString() !== userId) {
            return res.status(403).json({ message: "У вас нет доступа к этому чату" });
          }
          await User.findByIdAndUpdate(userId, {
            $pull: { chats: id }
          });
          res.status(200).json({message:"Удаление прошло успешно!"});
        } catch (error) {
          res.status(500).json({ message: "Ошибка при удалении чата", error });
        }
      }
}
export default new ChatController();