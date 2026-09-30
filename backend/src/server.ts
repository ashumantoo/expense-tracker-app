import express, { type Application, type Request, type Response, type NextFunction } from 'express'
import env from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'
import morgan from 'morgan'
import cookieSession from 'cookie-session';
import userAuthRouter from './routes/user.routes.ts';

const app: Application = express()

app.set('trust proxy', 1);

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
  } catch (error) {
    throw error;
  }
})()


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://expense-tracker-app-lime-zeta.vercel.app'
  ],
  credentials: true
}));

app.use(morgan('combined'));

//This cookieSession reuires no data saving at server side. to save the data at server side use express-session instead of cookieSession
// for more details read https://expressjs.com/en/resources/middleware/cookie-session/
app.use(
  cookieSession({
    name: "session",
    secret: process.env.DEV_SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000, // 24hr in milliseconds,
    httpOnly: true,
    // For localhost cross-origin development, browsers allow 'lax' if CORS handles credentials.
    // In Production (HTTPS), cross-domain cookies strictly require 'none' and secure: true.
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false, // Must be true in production (requires HTTPS)
  })
)

app.get('/', (req, res) => {
  try {
    res.status(200).send(`
      <div style="text-align: center; margin-top:20px; font-weight: bold;">
       </h3>Welcome, Expense Tracker Backend APIs</h3>
      </div>  
      `)
  } catch (error) {
    throw error;
  }
})

app.get('/health', (req, res) => {
  try {
    res.json({
      success: true,
      message: "Backend api healthy and running."
    })
  } catch (error) {
    throw error;
  }
})

//Routes
app.use('/api/v1/users', userAuthRouter)

//error handler at the app level
app.use((err: Error, req: Request, res: Response) => {
  res.status(500).json({
    message: err.message,
    error: err
  });
})

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})