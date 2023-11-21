import mongoose from 'mongoose';

let isConnected = false;
const url = process.env.MONGODB_URI;

export const connectionDb = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('data base connection successful');
    return;
  }
  if (!isConnected) {
    try {
      await mongoose.connect(url, {
        dbName: process.env.MONGO_DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('data base connection successful');
      isConnected = true;
    } catch (error) {
      console.log(error);
    }
  }
};
