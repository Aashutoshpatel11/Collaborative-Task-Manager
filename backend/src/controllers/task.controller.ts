import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { Task } from "../models/task.model"
import { taskSchema } from "../schema/taskSchema";
import { Request, Response } from "express";

const createTask = asyncHandler( async(req:Request, res:Response) => {
    const user = req.user
    const {title, description, dueDate, priority, status, assignedToId} = req.body

    const creatorId = user._id

    const validTask  = taskSchema.parse({title, description, dueDate, priority, status, creatorId, assignedToId})

    const task = await Task.create(validTask)
    if(!task){
        new ApiError(
            404,
            "Task not created"
        )
    }

    return res.json(
        new ApiResponse(
            200,
            task,
            "Task created successfully",
            true
        )
    )

} )

const createdTask = asyncHandler( async(req:Request, res:Response) => {
    const tasks = await Task.find({creatorId: req.user._id})
    
    if(!tasks.length){
        return res.json(
            new ApiResponse(
                200,
                tasks,
                "No tasks available for this user"
            )
        )
    }
    return res.json(
        new ApiResponse(
            200,
            tasks,
            "Tasks fetched"
        )
    )
} )

const assignedToMeTask = asyncHandler( async(req:Request, res:Response) => {
    const tasks = await Task.find({assignedToId: req.user._id})

    if(!tasks.length){
        return res.json(
            new ApiResponse(
                200,
                tasks,
                "No tasks available for this user"
            )
        )
    }
    return res.json(
        new ApiResponse(
            200,
            tasks,
            "Tasks fetched"
        )
    )
} )

const updateTask = asyncHandler( async(req:Request, res:Response) => {
    const taskId = req.params
    const user = req.user
    const {title, description, dueDate, priority, status, assignedToId} = req.body
    const creatorId = user._id

    const validTask  = taskSchema.parse({title, description, dueDate, priority, status, creatorId, assignedToId})

    const task = await Task.findByIdAndUpdate(
        taskId,
        validTask,
        {new:true}
    )

    if(!task){
        new ApiError(
            404,
            "Task not updated"
        )
    }else{
        return res.json(
            new ApiResponse(
                200,
                task,
                "Task updated successfully",
                true
            )
    )
    }
} )

const deleteTask = asyncHandler( async(req:Request, res:Response) => {
    const taskId = req.params

    const task = await Task.findByIdAndDelete(taskId)

    if(!task){
        new ApiError(
            404,
            "Task not deleted"
        )
    }else{
        return res.json(
            new ApiResponse(
                200,
                task,
                "Task deleted successfully",
                true
            )
    )
    }

} )

export {
    createTask,
    createdTask,
    assignedToMeTask,
    updateTask, 
    deleteTask
}