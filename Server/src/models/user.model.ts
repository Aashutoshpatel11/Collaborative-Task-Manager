import mongoose, {Schema, Document} from 'mongoose'
import jwt, { SignOptions } from 'jsonwebtoken'

export interface User extends Document{
    fullname: string,
    email: string,
    password: string,
    refreshToken: string,

    generateAccessToken(): string,
    generateRefreshToken(): string
}

const userSchema: Schema<User> = new Schema( {
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
}, {timestamps: true} )

userSchema.methods.generateAccessToken = function (): string {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
  const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"]

  const options: SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  }

  return jwt.sign(
    {
      _id: this._id,
      fullname: this.fullname,
      email: this.email,
    },
    ACCESS_TOKEN_SECRET,
    options
  )
}

userSchema.methods.generateRefreshToken = function (): string {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
  const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"]

  const options: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  }

  return jwt.sign(
    {
      _id: this._id,
      fullname: this.fullname,
      email: this.email,
    },
    REFRESH_TOKEN_SECRET,
    options
  )
}

export const User = mongoose.model<User>('User', userSchema)