import './config.js';
import express from 'express';
import connectDB from "./db/index.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import { app, server } from "./utils/socket.js"

// console.log("app cors: ",process.env.CORS_ORIGIN)

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.route.js"
import messageRouter from "./routes/message.route.js"

//routes declaration
app.use("/api/v1/user", userRouter)
app.use("/api/v1/message", messageRouter)

//errorHandler
app.use(errorHandler)

connectDB()

.then(() => {
    server.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️  Server is running at PORT: ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("❌  MongoDB connection failed !!!", error)
})