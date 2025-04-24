import { z } from "zod";

export const SignUpSchema = z.object({
    email:z.string({required_error: 'Email is required.'}).email('Invalid E-mail Id'),
    password: z.string().min(8, 'Password must be of more than 8 characters')
})