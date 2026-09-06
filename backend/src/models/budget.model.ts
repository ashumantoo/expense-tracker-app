import mongoose from "mongoose";
import { Schema } from "mongoose";

const BudgetSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, { timestamps: true })

export const BudgetModel = mongoose.model("Budget", BudgetSchema);