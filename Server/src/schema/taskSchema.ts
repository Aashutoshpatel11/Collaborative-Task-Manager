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
    .string()
    .regex(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),

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
