import {User} from '../models/user.model.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'
import { passwordSchema, registerSchema } from '../schema/registerSchema.js'
import {Request, response, Response} from 'express'
import bcrypt from "bcryptjs"
import { loginSchema } from '../schema/loginSchema.js'
import jwt from 'jsonwebtoken'

const register = asyncHandler( async(req:Request, res:Response) => {
    const {fullname, email, password} = req.body

    const userExistWithSameEmail = await User.findOne({email})
    if(userExistWithSameEmail){
        throw new ApiError(
            409,
            "User with same email already exists"
        )
    }

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

    const accessToken = existingUser.generateAccessToken()
    const refreshToken = existingUser.generateRefreshToken()

    // console.log("ACCESS TOKEN :: ", accessToken);
    // console.log("REFRESH TOKEN :: ", refreshToken);
    

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
    .cookie("refreshToken",refreshToken, {httpOnly:true, secure: true} )
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
    const user:any = req.user

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
    const user:any = req.user

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
    const userId:any = req.user!._id
    const user = await User.findByIdAndUpdate(
        userId,
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
    .clearCookie("accessToken", {httpOnly: true, secure:true})
    .clearCookie("refreshToken", {httpOnly: true, secure:true})
    .json(
        new ApiResponse(
            200,
            user,
            "User logged out successfully"
        )
    )
})

const getAllUserNames = asyncHandler( async(req:Request, res:Response) => {
    const users = await User.find().select('fullname')

    if(!users){
        throw new ApiError(
            404,
            "Can't fetch user"
        )
    }

    return res.json(
        new ApiResponse(
            200,
            users,
            "Users fetched successfully",
            true
        )
    )
} )

const getCurrentUser = asyncHandler( async(req:Request, res:Response) => {
    const {accessToken, refreshToken} = req.cookies

    const verifiedRefreshToken:any = jwt.verify(accessToken, process.env.REFRESH_TOKEN_SECRET||"") 
    const verifiedAccessToken:any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET||"")

    if(!verifiedRefreshToken){
        throw new ApiError(
            401,
            "User not unauthorized"
        )
    }


    const currentUser = await User.findById(verifiedRefreshToken?._id).select('-refreshToken -password')

    if(!currentUser){
        throw new ApiError(
            401,
            "User not unauthorized"
        )
    }

    if(!verifiedAccessToken){
        const newAccessToken = currentUser.generateAccessToken()

        return res
        .cookie("accessToken", newAccessToken, {httpOnly: true, secure: true})
        .cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
        .json(
            new ApiResponse(
                200,
                currentUser,
                "User is Authorized",
                true
            )
        )
    }

    return res
    .cookie("accessToken", accessToken, {httpOnly: true, secure: true})
    .cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
    .json(
        new ApiResponse(
            200,
            currentUser,
            "User is Authorized",
            true
        )
    )
} )

export {
    register,
    login, 
    updateDetails,
    changePassword,
    logout,
    getAllUserNames,
    getCurrentUser
}