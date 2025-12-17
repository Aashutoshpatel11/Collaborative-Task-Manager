import mongoose, {Schema, Document} from "mongoose";
import { User } from "./user.model";

export interface Task extends Document{
    title: string,
    description: string,
    dueDate: string,
    priority: string,
    status: string,
    creatorId: mongoose.Types.ObjectId,
    assignedToId: mongoose.Types.ObjectId
}

const taskSchema:Schema<Task> = new Schema({
    title: {
        type: String,
        max: [100, "Title can not exceed 100 character limit"],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: "Low"
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Review', 'Completed'],
        default: "To Do"
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        ref: User
    },
    assignedToId: {
        type: mongoose.Types.ObjectId,
        ref: User
    }
}, {timestamps: true})

export const Task = mongoose.model<Task>('Task', taskSchema)