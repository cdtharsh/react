import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required : [true, "Please provide unique Username"],
        unique: [true, "Username Exist"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique : false,
    },
    email: {
        type: String,
        required : [true, "Please provide a unique email"],
        unique: true,
    },
    firstName: { type: String},
    lastName: { type: String},
    mobile : { type : Number},
    address: { type: String},
    latitude: { type: Number },  // Add latitude
    longitude: { type: Number },
    profile: { type: String},
    role: {
        type: String,
        enum: ['user', 'admin'], // Define valid roles
        default: 'user' // Default role set to 'user'
    },
}, {timestamps: true});

export default mongoose.model.Users || mongoose.model('User', UserSchema);