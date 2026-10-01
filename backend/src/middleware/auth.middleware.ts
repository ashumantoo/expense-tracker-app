import jwt from 'jsonwebtoken'
import { type Request, type Response, type NextFunction } from 'express'

export interface IRequest extends Request {
  user?: {
    _id: string;
    email: string;
  }
}

export const isAuthenticated = (req: IRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Access token missing or malformed' })
    return
  }

  const token = authHeader.split(' ')[1]
  const secret = process.env.JWT_SECRET

  if (!secret) {
    res.status(500).json({ success: false, message: 'Internal server config secret key missing' })
    return
  }

  try {
    const decodedToken = jwt.verify(token || "", secret) as { _id: string, email: string }
    req.user = decodedToken
    next()
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid or expired token! Please login again.' })
    return
  }
}