import {z} from 'zod';
export const signinSchema = z.object({
    email: z.string({required_error: 'Email is required'}).email('Please enter a valid email.'),
    password: z.string({required_error: 'Password is required.'}).min(8, 'Password must be of 8 character'),
})