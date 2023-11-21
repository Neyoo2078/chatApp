import { Schema, models, model } from 'mongoose';
import mongoose from 'mongoose';

const messageSchema = new Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  messageType: { type: String, default: 'text' },
  message: String,
  messageStatus: { type: String, default: 'sent' },
  createdAt: { type: Date, default: Date.now },
});

const Messages = models.Messages || model('Messages', messageSchema);

export default Messages;
