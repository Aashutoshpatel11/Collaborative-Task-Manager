import {User} from '../models/user.model'
import {asyncHandler} from '../utils/asyncHandler'
import {ApiResponse} from '../utils/ApiResponse'
import {ApiError} from '../utils/ApiError'
import { registerSchema } from '../schema/registerSchema'
import {Request, Response} from 'express'
import bcrypt from "bcryptjs"

const register = asyncHandler( async(req:Request, res:Response) => {
    const {fullname, email, password} = req.body

    if(!fullname || !email || !password ){
        throw new ApiError(
            400,
            "Provide all details"
        )
    }

    const validCredentials = registerSchema.parse({fullname, email, password})

    // console.log("{fullname, email, password}",validatedCredentials);

    const hashedPassword = await bcrypt.hash(validCredentials.password, 10);    

    const user = await User.create(
        {
            fullname: validCredentials.fullname,
            email: validCredentials.email,
            password: hashedPassword,
        },
    )



} )

export {
    register
}