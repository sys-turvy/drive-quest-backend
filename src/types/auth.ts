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
  token: string
  user: Pick<User, 'id' | 'userId' | 'email' | 'userName' | 'userIconUrl'>
}

export type JwtPayload = {
  id: string
  email: string
} 