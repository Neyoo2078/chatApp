'use server';

import { connectionDb } from '../DataBase';
import Users from '@/model/User';
import { data } from '../data';
interface prop {
  name: string | null | undefined;
  email: string | undefined | null;
  image: string | undefined | null;
}

export const getUser = async ({ name, email, image }: prop) => {
  try {
    connectionDb();
    // find user by email
    const user = await Users.findOne({ email });

    if (!user) {
      const res = await Users.create({ name, email, image });

      return JSON.stringify(res);
    } else {
      return JSON.stringify(user);
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
export const GetUserByEmail = async ({
  email,
}: {
  email: string | null | undefined;
}) => {
  console.log({ email });
  try {
    connectionDb();
    const res = await Users.findOne({ email });
    return JSON.stringify(res);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const UpdateProfile = async ({
  avatar,
  displayName,
  about,
  newUser,
  id,
}: any) => {
  console.log({
    avatar,
    displayName,
    about,
    newUser,
    id,
  });
  try {
    connectionDb();

    console.log('we entered');
    const res = await Users.findByIdAndUpdate(
      id,
      { avatar, displayName, about, newUser },
      { new: true }
    );
    return JSON.stringify(res);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const addAllUsers = async () => {
  try {
    connectionDb();
    const res = await Users.insertMany(data);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getAllUsers = async ({ email }: any) => {
  try {
    connectionDb();
    const res = await Users.find({});
    const filterUser = res.filter((items) => items.email !== email);
    return JSON.stringify(filterUser);
  } catch (error: any) {
    throw new Error(error);
  }
};
