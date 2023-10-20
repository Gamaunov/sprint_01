import { ObjectId } from 'mongodb'

export type ConfirmCodeType = {
  code: string
}

export type EmailType = {
  email: string
}

export type LoginType = {
  login: string
}

export type LoginOrEmailType = {
  loginOrEmail: string
  password: string
}

export type UserInfoType = {
  email: string
  login: string
  userId: ObjectId
}
