'use server';

import { connectionDb } from '../DataBase';
import Messages from '@/model/message';

export const CreateDbMessage = async ({
  senderId,
  receiverId,
  message,
}: any) => {
  try {
    console.log({ senderId, receiverId, message });
    connectionDb();
    const res = await Messages.create({ senderId, receiverId, message });
    return JSON.stringify(res);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const ChatWithActiveUser = async ({ currentUser, ActiveChat }: any) => {
  console.log({ currentUser, ActiveChat });
  try {
    connectionDb();
    const res = await Messages.find({
      $or: [
        { senderId: currentUser, receiverId: ActiveChat },
        { senderId: ActiveChat, receiverId: currentUser },
      ],
    }).sort({ createdAt: 1 });

    const updateMessagesStatus = await Messages.updateMany(
      { $and: [{ senderId: ActiveChat }, { receiverId: currentUser }] },
      { $set: { messageStatus: 'read' } },
      { new: true }
    );
    return JSON.stringify(res);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getConatctFromMessage = async ({ userid }: { userid: string }) => {
  try {
    connectionDb();
    const res = await Messages.find({
      $or: [{ senderId: userid }, { receiverId: userid }],
    })
      .populate({ path: 'senderId', model: 'User' })
      .populate({ path: 'receiverId', model: 'User' });

    const contactCollecttion: any = {};
    res.forEach((item, i) => {
      const recipient =
        item.senderId._id === userid ? item.receiverId._id : item.senderId._id;
      const recipientInfo =
        item.senderId._id === userid ? item.receiverId : item.senderId;
      if (!contactCollecttion[recipient]) {
        contactCollecttion[recipient] = {
          info: recipientInfo,
          messages: [item],
        };
      } else {
        contactCollecttion[recipient]?.messages.push(item);
      }
    });
    const NewCollct = Object.entries(contactCollecttion).map(
      ([id, values]: any) => {
        return { _id: id, info: values?.info, messages: values.messages };
      }
    );
    console.log({ NewCollct });
  } catch (error: any) {
    throw new Error(error);
  }
};
