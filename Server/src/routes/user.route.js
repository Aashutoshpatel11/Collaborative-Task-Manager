import { Router } from "express";

const userRoute = Router()

// ROUTE IMPORTS
import { changePassword, getAllUserNames, login, logout, register, updateDetails } from "../controllers/user.controller.ts";
import { authJwt } from "../middlewares/auth.middleware.ts";

userRoute.route('/register').post(register)
userRoute.route('/login').post(login)
userRoute.route('/update-details').post(authJwt, updateDetails)
userRoute.route('/change-password').post(authJwt, changePassword)
userRoute.route('/logout').get(authJwt, logout)
userRoute.route('/get-all-users-name').get(authJwt, getAllUserNames)

export default userRoute