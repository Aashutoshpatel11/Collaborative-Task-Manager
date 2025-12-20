import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { Task } from "../models/task.model"
import { taskSchema } from "../schema/taskSchema";
import { Request, Response } from "express";
import { getIo } from "../socket/socket";

const createTask = asyncHandler( async(req:Request, res:Response) => {
    
    const user:any = req.user
    const {title, description, dueDate, priority, status, assignedToId} = req.body

    const creatorId = user._id.toString()
    

    const validTask  = taskSchema.parse({title, description, dueDate, priority, status, creatorId, assignedToId})
    // console.log("VALIDTASK :: ", validTask);

    const task = await Task.create(validTask)
    if(!task){
        new ApiError(
            404,
            "Task not created"
        )
    }

    const io = getIo()

    // io.on('connection', (socket) => {
    //     console.log("Socket IN TASk")
        io.emit("Task", task )
    // })

    return res.json(
        new ApiResponse(
            200,
            task,
            "Task created successfully",
            true
        )
    )

} )

const allTask = asyncHandler( async(req:Request, res:Response) => {
    const tasks = await Task.find().populate({
        path: 'creatorId',
        select: 'fullname'
    }).populate({
        path: 'assignedToId',
        select: 'fullname'
    })

    // const tasks = await Task.aggregate(
    //     [
    //         {
    //             $match: {}
    //         },
    //         {
    //             $lookup: {
    //                 from: "User",
    //                 localField: "creatorId",
    //                 foreignField: "_id",
    //                 as: "Assignee",
    //                 pipeline: [
    //                     {
    //                         $project: {
    //                             fullname: 1
    //                         }
    //                     }
    //                 ]
    //             }
    //         },
    //         {
    //             $addFields:{
    //                 assignee: {
    //                     $first: "$Assignee"
    //                 }
    //             }
    //         }
    //         // {
    //         //     $addFields: {
    //         //         assignee: "$Assignee"

    //         //     }
    //         // }
    //     ]
    // )
    
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

const createdTask = asyncHandler( async(req:Request, res:Response) => {
    const user:any = req.user
    const tasks = await Task.find({creatorId: user._id})
    
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
    const user:any = req.user
    const tasks = await Task.find({assignedToId: user._id})

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
    const {taskId} = req.params
    const user:any = req.user
    const {title, description, dueDate, priority, status, assignedToId} = req.body
    const creatorId = user._id.toString()

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
    const {taskId} = req.params

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
    allTask,
    createdTask,
    assignedToMeTask,
    updateTask, 
    deleteTask
}