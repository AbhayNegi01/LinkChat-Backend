import "../config.js";
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// console.log("socket cors: ",process.env.CORS_ORIGIN)

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
    },
})

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

//to store online users
const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // console.log("Socket Handshake: ", socket.handshake.query);
    const userId = socket.handshake.query.userId;
    // console.log("User Id",userId)
    if(userId) userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients 
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export {
    io,
    app,
    server
}