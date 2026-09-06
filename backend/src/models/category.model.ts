import mongoose from "mongoose";
import { Schema } from "mongoose";

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, { timestamps: true })

export const CategoryModel = mongoose.model("Category", CategorySchema);