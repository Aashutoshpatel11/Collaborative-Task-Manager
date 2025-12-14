import {z} from 'zod'

const loginSchema = z.object({
    email: z
    .email("invalid Email"),
    password: z
    .string()
    .min(8, "password should be of atleast 8 character")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, "Invalid Password")
})

export {loginSchema}