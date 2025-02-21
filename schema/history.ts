import mongoose from "mongoose";
const { Schema } = mongoose;

const historySchema = new Schema({
  initiator: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  amount: Number,
  history: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
      split: Number,
    },
  ],
});

export const HistoryModel =
  mongoose.models.history || mongoose.model("history", historySchema);
