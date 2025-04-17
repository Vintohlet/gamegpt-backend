import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import "dotenv/config"
import authRoutes from "./routes/auth.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import messageRoutes from "./routes/message.routes.js"

const app = express();
const corsOptions = {
    origin: 'https://game-gpt-frontend.vercel.app', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions))
app.use(express.json()) 
const DB_PASSWORD = process.env.DB_PASSWORD;

const connectionString = `mongodb+srv://user:${DB_PASSWORD}@cluster0.tq3hnbx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

async function connectDB() {
    try {
         await mongoose.connect(connectionString)
         console.log("Connected to DB!")
    } catch (error) {
        console.log("Error to connect DB")
        console.log(error)
    }
}
app.use("/auth", authRoutes)
app.use("/chat", chatRoutes)
app.use("/messages", messageRoutes)

app.listen(3333, async() =>{
    await connectDB();
    console.log(`Server on http://localhost:3333`)
    
})
