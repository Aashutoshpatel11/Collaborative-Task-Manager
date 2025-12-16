import {User} from '../models/user.model'
import {asyncHandler} from '../utils/asyncHandler'
import {ApiResponse} from '../utils/ApiResponse'
import {ApiError} from '../utils/ApiError'
import { passwordSchema, registerSchema } from '../schema/registerSchema'
import {Request, response, Response} from 'express'
import bcrypt from "bcryptjs"
import { loginSchema } from '../schema/loginSchema'

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

    if(!user){
        throw new ApiError(
            404,
            "User not registered"
        )
    }

    return res.json(
        new ApiResponse(
            200,
            user,
            "User registered successfully",
            true
        )
    )

} )

const login = asyncHandler( async(req:Request, res:Response) => {
    const {email, password} = req.body
    if(!email || !password ){
        throw new ApiError(
            400,
            "Provide all details"
        )
    }

    const validCredentials = loginSchema.parse({email, password})

    const existingUser = await User.findOne({email: validCredentials.email})
    if(!existingUser){
        throw new ApiError(
            404,
            "User not found"
        )
    }

    const isPasswordCorrect = await bcrypt.compare(validCredentials.password, existingUser.password)
    if(!isPasswordCorrect){
        throw new ApiError(
            401,
            "Wrong password"
        )
    }

    const accessToken = await existingUser.generateAccessToken()
    const refreshToken = await existingUser.generateRefreshToken()

    console.log("ACCESS TOKEN :: ", accessToken);
    console.log("REFRESH TOKEN :: ", refreshToken);
    

    if(!(accessToken||refreshToken)){
        throw new ApiError(
            404,
            "Something went wrong while generating jwt tokens"
        )
    }

    existingUser.refreshToken = refreshToken

    await existingUser.save()

    const loggedInUser = await User.findById(existingUser._id).select('-password -refreshToken')

    if(!loggedInUser){
        throw new ApiError(
            404,
            "User not logged in"
        )
    }

    return res
    .cookie("accessToken",accessToken, {httpOnly:true, secure: true} )
    .json(
        new ApiResponse(
            200,
            loggedInUser,
            "User logged in successfully",
            true
        )
    )
    
} )

const updateDetails = asyncHandler( async(req:Request, res:Response) => {
    const user = req.user

    const {fullname, email} = req.body

    if(!fullname || !email ){
        throw new ApiError(
            400,
            "Provide all details"
        )
    }

    const existingUser = await User.findByIdAndUpdate(
        user._id,
        {
            fullname,
            email
        },
        {new : true}
    )

    if(!existingUser){
        throw new ApiError(
            400,
            "Details not updated"
        )
    }

    return res.json(
        new ApiResponse(
            200,
            existingUser,
            "User details updated successfully",
            true
        )
    )
} )

const changePassword = asyncHandler( async(req:Request, res:Response ) => {
    const {oldPassword, newPassword} = req.body
    const user = req.user

    console.log("OLD :: ", oldPassword);
    console.log("NEW :: ", newPassword);

    const existingUser = await User.findById(user._id)
    if(!existingUser){
        throw new ApiError(
            404,
            "User not found"
        )
    }

    // console.log("ESISTING USER :: ", existingUser);
    

    const isPasswordCorrect = await bcrypt.compare(oldPassword, existingUser?.password)
    if(!isPasswordCorrect){
        if(!isPasswordCorrect){
        throw new ApiError(
            401,
            "Wrong password"
        )
    }

    
    }
    console.log("IS POSSWORD CORRECT :: ", isPasswordCorrect);

    const newValidPassword = passwordSchema.parse({password: newPassword})

    const hashedNewPassword = await bcrypt.hash(newValidPassword.password, 10)

    existingUser.password = hashedNewPassword
    
    await existingUser.save({validateBeforeSave: false})

    const updatedUser = await User.findById(existingUser._id).select('-password -refreshToken')

    if(!updatedUser){
        throw new ApiError(
            404,
            "Password not updated"
        )
    }

    return res.json(
        new ApiResponse(
            200,
            updatedUser,
            "Password updated successfully",
            true
        )
    )
} )

const logout = asyncHandler( async(req:Request, res:Response) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            refreshToken: ""
        },
        {new: true}
    ).select('-password -refreshToken')

    if(!user){
        throw new ApiError(
            404,
            "User not logged out"
        )
    }

    return res
    .clearCookie("accessToken", {httpOnly: true, secrue:true})
    .json(
        new ApiResponse(
            200,
            user,
            "User logged out successfully"
        )
    )
})

export {
    register,
    login, 
    updateDetails,
    changePassword,
    logout
}