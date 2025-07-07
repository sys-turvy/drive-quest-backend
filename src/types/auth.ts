import { User } from '@prisma/client'

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  email: string
  password: string
}

export type LoginResponse = {
  tokenPair: {
    token: string,
    refreshToken: string
  }
  user: Pick<User, 'id' | 'userId' | 'email' | 'userName' | 'userIconUrl'>
}

export type JwtPayload = {
  id: string
  email: string
} 