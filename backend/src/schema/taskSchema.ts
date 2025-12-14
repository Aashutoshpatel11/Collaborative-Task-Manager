import { z } from "zod";
import mongoose from "mongoose";

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .min(1, "Description is required"),

  dueDate: z
    .date(),

  priority: z
    .enum(["Low", "Medium", "High", "Urgent"]),

  status: z
    .enum([ "To Do", "In Progress", "Review", "Completed"]),

  creatorId: z
    .string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid creatorId"
    }),

  assignedToId: z
    .string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid assignedToId"
    })
});

export {taskSchema}
