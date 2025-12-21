import { Router } from "express";
import { authJwt } from "../middlewares/auth.middleware.js";

const taskRoute = Router()


// ROUTES
import { allTask, assignedToMeTask, createdTask, createTask, deleteTask, updateTask } from "../controllers/task.controller.js";

taskRoute.route('/create').post(authJwt, createTask)
taskRoute.route('/all-tasks').get( allTask)
taskRoute.route('/created-tasks').get(authJwt, createdTask)
taskRoute.route('/assigned-tasks').get(authJwt, assignedToMeTask)
taskRoute.route('/update/:taskId').patch(authJwt, updateTask)
taskRoute.route('/delete/:taskId').delete(authJwt, deleteTask)

export default taskRoute