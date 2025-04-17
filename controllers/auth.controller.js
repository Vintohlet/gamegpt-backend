import {User} from "../models/User.js"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { hashPassword, checkValidPassword } from "../services/bcrypt.js"

class AuthController{
    async userRegister(req, res) {
        try {
          const { userName, email, password} = req.body;
          const user = await User.findOne({ email });
          if (user) {
            return res.status(409).json({ message: "Email занят" });
          }
          const hashedPassword = await hashPassword(password);
          const newUser = await new User({
            userName,
            email,
            password: hashedPassword,
          }).save();
          const token = jwt.sign(
            { userId: newUser._id},
            process.env.SECRET_KEY,
            { expiresIn: "12h" }
          );
          res.status(201).json( { token , newUser});
   
        } catch (error) {
          console.log(error)
          res.status(500).json({ error: error.message });
        }
      }
      async userLogin(req, res) {
        try {
            const { email, password } = req.body;
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "Неверный Email или Пароль" });
            }
            const passwordIsValid = await checkValidPassword(password, user.password);
            if (!passwordIsValid) {
                return res.status(404).json({ message: "Неверный Email или Пароль" });
            }
            const token = jwt.sign(
                { userId: user._id},
                process.env.SECRET_KEY,
                { expiresIn: "12h" }
            );
    
            res.json({ token, user});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
export default new AuthController();