import { type Request, type Response, type NextFunction } from 'express'
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session?.userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid session. Please login again"
      })
    }
    next()
  } catch (error) {
    next(error)
  }
}