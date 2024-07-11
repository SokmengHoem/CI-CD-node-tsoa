import { Schema, Types, model } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  age:number;
}

export interface UserCreationParams {
  name: string;
  email: string;
  age: number;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
});

const User = model<IUser>('User', userSchema);

export default User;