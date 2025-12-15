import mongoose, {Schema, Document} from 'mongoose'
import jwt from 'jsonwebtoken'

export interface User extends Document{
    fullname: string,
    email: string,
    password: string,
    refreshToken: string,
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
        required: true,
    },
}, {timestamps: true} )

userSchema.methods.generateAccessToken = function():string {
    const accessToken:string = jwt.sign(
        {
            _id: this._id,
            fullname: this.fullname,
            email: this.email
        },
        `${process.env.ACCESS_TOKEN_SECRET}`,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

    return accessToken
}

userSchema.methods.generateRefreshToken = function():string {
    const RefreshToken:string = jwt.sign(
        {
            _id: this._id
        },
        `${process.env.REFRESH_TOKEN_SECRET}`,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

    return RefreshToken
}

export const User = mongoose.model<User>('User', userSchema)