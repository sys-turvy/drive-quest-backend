import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types/auth'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '15m' // アクセストークン
const REFRESH_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000 // 7日間
const SALT_ROUNDS = 10

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex')
}

export function getRefreshTokenExpiry() {
  return new Date(Date.now() + REFRESH_EXPIRES_IN_MS)
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
} 