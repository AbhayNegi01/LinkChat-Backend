import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../utils/cloudinary.js"
import { getReceiverSocketId, io } from "../utils/socket.js";

const getUsers = asyncHandler(async (req, res) => {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find(
        {
            _id: { $ne: loggedInUserId }
        }
    ).select("-password -refreshToken")

    if(!filteredUsers) {
        throw new ApiError(500, "Something went wrong when fetching the users.")
    }

    return res.status(200)
    .json(new ApiResponse(200, filteredUsers, "All the users are fetched."))
})

const getMessages = asyncHandler(async (req, res) => {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const message = await Message.find({
        $or: [
            {
                senderId: myId, 
                receiverId: userToChatId
            },
            {
                senderId: userToChatId, 
                receiverId: myId
            }
        ]
    })

    if(!message) {
        throw new ApiError(500, "Something went wrong when fetching messages.")
    }

    return res.status(200)
    .json(new ApiResponse(200, message, "Messages fetched successfully."))
})

const sendMessage = asyncHandler(async (req, res) => {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if(image) {
        const uploadResponse = await cloudinary.uploader.upload(image, {
            resource_type: "auto",
            maxSizeMB: 10
        });
        imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl
    })

    await newMessage.save();

    if (!newMessage) {
        throw new ApiError(500, "Something went wrong while creating the message.");
    }

    //realtime functionality
    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }
    
    return res.status(201)
    .json(new ApiResponse(200, newMessage, "message is created"))
})

export {
    getUsers,
    getMessages,
    sendMessage
}