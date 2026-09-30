import express from 'express'
import { getUser, logout, signin, signup, updateUser } from '../controllers/user.controller.ts';
import { isAuthenticated } from '../middleware/auth.middleware.ts';

const userAuthRouter = express.Router();

userAuthRouter.post('/signup', signup)
userAuthRouter.post('/login', signin)
userAuthRouter.post('/logout', logout)
userAuthRouter.get('/me', isAuthenticated, getUser)
userAuthRouter.put('/me', isAuthenticated, updateUser)

export default userAuthRouter;