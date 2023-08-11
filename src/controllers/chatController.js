const ChatModel = require("../models/chatModel");
const { sendResponse } = require("../helpers/requestHandlerHelper");

exports.createChat = async (req, res) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const result = await newChat.save();
    return sendResponse(res, true, 200, "chat created",result);
  } catch (error) {
    return sendResponse(res, false, 500, error);
  }
};

exports.userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    return sendResponse(res, true, 200, "chats",chat);
  } catch (error) {
    return sendResponse(res, false, 500, error);
  }
};

exports.findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    return sendResponse(res, true, 200, "chat found",chat);
  } catch (error) {
    return sendResponse(res, false, 500, error);
  }
};