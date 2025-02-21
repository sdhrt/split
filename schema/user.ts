import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
}

const userSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
  },
  password: String,
});

export const UserModel =
  mongoose.models.user || mongoose.model("user", userSchema);
