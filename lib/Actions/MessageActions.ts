'use server';

import { connectionDb } from '../DataBase';
import Messages from '@/model/message';
import { revalidatePath } from 'next/cache';

export const CreateDbMessage = async ({
  senderId,
  receiverId,
  message,
  path,
  messageType,
  messageStatus,
}: any) => {
  try {
    console.log({
      senderId,
      receiverId,
      message,
      path,
      messageType,
      messageStatus,
    });
    connectionDb();

    const res = await Messages.create({
      senderId,
      receiverId,
      message,
      messageType,
      messageStatus,
    });
    revalidatePath(path);
    return JSON.stringify(res);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const ChatWithActiveUser = async ({ currentUser, ActiveChat }: any) => {
  try {
    connectionDb();
    await Messages.updateMany(
      {
        $and: [
          {
            $or: [
              { senderId: currentUser, receiverId: ActiveChat },
              { senderId: ActiveChat, receiverId: currentUser },
            ],
          },
          {
            messageStatus: 'delivered',
          },
        ],
      },
      { messageStatus: 'read' }
    );
    const res = await Messages.find({
      $or: [
        { senderId: currentUser, receiverId: ActiveChat },
        { senderId: ActiveChat, receiverId: currentUser },
      ],
    }).sort({ createdAt: 1 });

    // const updateMessagesStatus = await Messages.updateMany(
    //   { $and: [{ senderId: ActiveChat }, { receiverId: currentUser }] },
    //   { $set: { messageStatus: 'read' } },
    //   { new: true }
    // );
    revalidatePath('/');
    return JSON.stringify(res);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getConatctFromMessage = async ({ userid }: { userid: string }) => {
  try {
    connectionDb();
    const undateMessageStatus = await Messages.updateMany(
      {
        $and: [
          { $or: [{ senderId: userid }, { receiverId: userid }] },
          {
            messageStatus: 'sent',
          },
        ],
      },
      { messageStatus: 'delivered' }
    );

    const res = await Messages.find({
      $or: [{ senderId: userid }, { receiverId: userid }],
    })
      .populate({ path: 'senderId', model: 'User' })
      .populate({ path: 'receiverId', model: 'User' })
      .sort({ createdAt: -1 });

    const contactCollecttion: any = {};

    res.forEach((item, i) => {
      const recipient =
        item.senderId._id.toString() === userid
          ? item.receiverId._id
          : item.senderId._id;

      const recipientInfo =
        item.senderId._id.toString() === userid
          ? item.receiverId
          : item.senderId;

      if (!contactCollecttion[recipient]) {
        contactCollecttion[recipient] = {
          info: recipientInfo,
          messages: [item],
        };
      } else {
        contactCollecttion[recipient]?.messages.push(item);
      }
    });
    console.log({ contactCollecttion });
    const NewCollct = Object.entries(contactCollecttion).map(
      ([id, values]: any) => {
        return { _id: id, info: values?.info, messages: values.messages };
      }
    );
    const FilterNewCollct = NewCollct.filter((items) => items._id !== userid);

    return JSON.stringify(FilterNewCollct);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const revPath = () => {
  revalidatePath('/');
};
