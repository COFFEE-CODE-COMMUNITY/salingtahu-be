declare namespace Express {
  interface Request {
    userId?: string
    authorized: boolean
  }
}
