import { type Request, type Response } from 'express'
import { UserModel } from '../models/user.model.ts';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken'
import type { IRequest } from '../middleware/auth.middleware.ts';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email })
    if (user) {
      return res.json({
        success: false,
        message: "User with this email already exist"
      })
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = new UserModel({
      email,
      password: hashPassword
    })
    await newUser.save()
    return res.status(201).json({
      success: true,
      message: "User created."
    })
  } catch (error) {
    throw error;
  }
}


export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    const passwordMatched = await bcrypt.compare(password, user.password)
    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }
    // if (req.session) {
    //   req.session.userId = user._id
    //   req.session.email = user.email
    // }
    const token = JWT.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      success: true,
      message: "Login success",
      token,
      user: { id: user.id, email: user.email },
    })
  } catch (error) {
    throw error;
  }
}


export const getUser = async (req: IRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const user = await UserModel.findById({ _id: userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    return res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    throw error;
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req?.session?.userId
    const user = await UserModel.findById({ _id: userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    const { firstName, lastName, profileImageUrl } = req.body;
    const updatedUser = {
      firstName,
      lastName,
      profileImageUrl
    }
    const updatedUserDoc = await UserModel.findByIdAndUpdate(userId, updatedUser, {
      returnDocument: "after"
    });
    return res.status(200).json({
      success: true,
      user: updatedUserDoc
    })
  } catch (error) {
    throw error;
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    req.session = null
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    throw error;
  }
}