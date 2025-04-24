import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
}

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'admin'
    },
},{timestamps: true})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User',userSchema);
export default UserModel;