import mongoose, {Schema, Document} from 'mongoose'

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

export const User = mongoose.model<User>('User', userSchema)