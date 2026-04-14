import { Message } from '../models/chatModels.js';

export const saveMessage = async (data) => {
  const message = new Message({
    conversationId: data.conversationId,
    senderId: data.senderId,
    content: data.content,
    fileUrl: data.fileUrl,
  });
  return await message.save();
};

export const updateMessageStatus = async (messageId, status) => {
  return await Message.findByIdAndUpdate(messageId, { status }, { new: true });
};
