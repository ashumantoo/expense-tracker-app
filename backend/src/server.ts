import express, { type Application } from 'express'
import env from 'dotenv';
import mongoose from 'mongoose';

const app: Application = express()

env.config();

const PORT = process.env.PORT || 8000;
const MONGO_USER = process.env.DEV_MONGO_USER;
const MONGO_PASSWORD = process.env.DEV_MONGO_PASSWORD;
const MONGO_IP = process.env.DEV_MONGO_CONTAINER_IP;
const MONGO_PORT = process.env.DEV_MONGO_CONTAINER_PORT;

(async () => {
  try {
    if (process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log("Production Database is connected.")
    } else {
      await mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
      console.log("Development Database is connected.")
    }
  } catch (err) {
    throw new Error("Missing database env variables!")
  }
})()


app.use(express.json())


app.get('/health', (req, res) => {
  try {
    res.json({
      success:true,
      message:"Backend api healthy and running."
    })
  } catch (error) {
    throw error;
  }
})


app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})