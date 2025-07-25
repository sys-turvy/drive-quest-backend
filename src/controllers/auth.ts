import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { LoginInput, LoginResponse, RegisterInput } from '../types/auth'
import { comparePassword, generateToken, generateRefreshToken, hashPassword, getRefreshTokenExpiry } from '../utils/auth'

export class AuthController {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  public register = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response<LoginResponse | { message: string }>
  ): Promise<void> => {
    try {
      const { email, password } = req.body

      const existingUser = await this.prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        res.status(400).json({ message: 'このメールアドレスは既に登録されています' })
        return
      }

      const hashedPassword = await hashPassword(password)

      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          profile: {
            create: {},
          },
        },
      })

      const token = generateToken({
        id: user.id,
        email: user.email
      })
      const refreshToken = generateRefreshToken()

      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: getRefreshTokenExpiry()
        }
      })

      const response: LoginResponse = {
        tokenPair: {
          token,
          refreshToken
        },
        user: {
          id: user.id,
          userId: user.userId,
          email: user.email,
          userName: user.userName,
          userIconUrl: user.userIconUrl
        }
      }

      res.status(201).json(response)
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({ message: '新規登録に失敗しました' })
    }
  }

  public login = async (
    req: Request<{}, {}, LoginInput>,
    res: Response<LoginResponse | { message: string }>
  ): Promise<void> => {
    try {
      const { email, password } = req.body

      const user = await this.prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        res.status(401).json({ message: 'メールアドレスまたはパスワードが間違っています' })
        return
      }

      const isValidPassword = await comparePassword(password, user.password)
      if (!isValidPassword) {
        res.status(401).json({ message: 'メールアドレスまたはパスワードが間違っています' })
        return
      }

      const token = generateToken({ id: user.id, email: user.email })
      const refreshToken = generateRefreshToken()

      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: getRefreshTokenExpiry()
        }
      })

      const response: LoginResponse = {
        tokenPair: {
          token,
          refreshToken
        },
        user: {
          id: user.id,
          userId: user.userId,
          email: user.email,
          userName: user.userName,
          userIconUrl: user.userIconUrl
        }
      }

      res.json(response)
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ message: 'ログインに失敗しました' })
    }
  }

  public refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.status(400).json({ message: 'refreshToken が必要です' })
      return
    }

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    })

    if (!storedToken || storedToken.expiresAt < new Date()) {
      res.status(401).json({ message: '無効なリフレッシュトークンです' })
      return
    }

    const newToken = generateToken({
      id: storedToken.user.id,
      email: storedToken.user.email
    })

    res.json({ token: newToken })
  }
} 