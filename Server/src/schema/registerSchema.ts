import {z} from 'zod'

const emailSchema = z.object({
    email: z
    .email("invalid Email")
})

const passwordSchema = z.object({
    password: z
    .string()
    .min(8, "password should be of atleast 8 character")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, "Invalid Password")
})

const registerSchema = z.object({
    fullname: z
    .string(),
    email: z
    .email("invalid Email"),
    password: z
    .string()
    .min(8, "password should be of atleast 8 character")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, "Invalid Password")
})

export {
    registerSchema,
    emailSchema,
    passwordSchema
}