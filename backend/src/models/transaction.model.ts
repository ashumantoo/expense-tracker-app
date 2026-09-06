import mongoose from "mongoose";
import { Schema } from "mongoose";

const TransactionSchema = new Schema({
  transactionType: {
    type: String,
    enum: ["INCOME", "EXPENSE", "SAVING"],
    required: true
  },
  transactionDateTime: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  note: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  documents: {
    type: [String],
    default: []
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
  },
  budget: {
    type: Schema.Types.ObjectId,
    ref: 'Budget'
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, { timestamps: true })

export const TransactionModel = mongoose.model("User", TransactionSchema);