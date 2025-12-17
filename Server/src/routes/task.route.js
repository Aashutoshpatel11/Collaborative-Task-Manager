import { Router } from "express";
import { authJwt } from "../middlewares/auth.middleware";

const taskRoute = Router()


// ROUTES
import { assignedToMeTask, createdTask, createTask, deleteTask, updateTask } from "../controllers/task.controller";

taskRoute.route('/create').post(authJwt, createTask)
taskRoute.route('/created-tasks').get(authJwt, createdTask)
taskRoute.route('/assigned-tasks').get(authJwt, assignedToMeTask)
taskRoute.route('/update/:taskId').patch(authJwt, updateTask)
taskRoute.route('/delete/:taskId').delete(authJwt, deleteTask)

export default taskRoute