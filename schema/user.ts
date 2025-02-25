import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
  },
  password: String,
});

export const UserModel =
  mongoose.models.user || mongoose.model("user", userSchema);
