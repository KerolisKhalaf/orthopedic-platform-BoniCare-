import mongoose from 'mongoose';
import NotificationPreferences from './NotificationPreferences.js';

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  type: { type: String, enum: ['direct', 'group'], default: 'direct' },
  archived: { type: Boolean, default: false },
}, { timestamps: true });

export const Conversation = mongoose.model('Conversation', conversationSchema);

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  content: { type: String, maxlength: 5000 },
  fileUrl: { type: String },
  status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent', index: true },
  sequenceId: { type: Number },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = mongoose.model('Message', messageSchema);

export { NotificationPreferences };
