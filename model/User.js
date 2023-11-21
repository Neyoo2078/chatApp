import { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, unique: [true, 'name already exist'] },
  email: { type: String, unique: [true, 'email already exist'] },
  newUser: { type: Boolean, default: true },
  availability: { type: Boolean, default: false },
  image: { type: String },
  avatar: { type: String },
  displayName: { type: String },
  about: { type: String },
});

const Users = models.User || model('User', UserSchema);

export default Users;
