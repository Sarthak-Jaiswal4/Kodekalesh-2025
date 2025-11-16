import mongoose, { Schema, Document, Types } from "mongoose";
import { CaseDocument } from "./case.model";

export interface User extends Document {
    username: string;
    email: string;
    password?: string;
    isverified: boolean;
    verificationcode: string;
    ExpiryTime: Date;
    specialties?: string[];
    maxCaseLoad?: number;
    status: "Active" | "On Vacation" | "On Leave" | "Admin Duty";
    cases: Types.ObjectId[] | CaseDocument[];
    role: "judge" | "clerk"
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        // unique: true,
        match: [/.+\@.+\..+/, "please use a valid email address"]
    },
    password: {
        type: String,
        // required:[true,'password is required']
    },
    isverified: {
        type: Boolean,
        default: false,
    },
    verificationcode: {
        type: String,
    },
    ExpiryTime: {
        type: Date
    },
    specialties: [{
        type: String, // e.g., 'Civil-Corporate', 'Criminal-Appellate', 'Family Law'
        index: true,
        // required: [true, 'specialties is required'],
    }],
    maxCaseLoad: {
        type: Number,
        default: 100 
    },
    // // --- Data for Conflict Checking ---
    // conflictEntities: [{
    //     type: Schema.Types.ObjectId, // List of 'Entity' IDs (firms, people)
    //     ref: 'Entity'
    // }],
    // --- Current Status ---
    status: {
        type: String,
        enum: ['Active', 'On Vacation', 'On Leave', 'Admin Duty'],
        default: 'Active'
    },
    role: {
        type: String,
        enum: ['judge', 'clerk'],
        required: true,
    }
});

const userModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));
export default userModel