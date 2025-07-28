import  * as mongoose from "mongoose"

type User = {
    name: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: true,
        minlength: [3,"Name must be at least 3 characters long"],
    },
    email: {
        type: String,
        required: [true, "Please enter a valid email"],
        unique: [true, "User already exists"],
        trim: true,
        lowercase: true,
        index: true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"fill valid email"]
    },
    password: {
        type: String,
        required: true,
        minlength: [5,"Password must be at least 5 characters long"],
    }
})

export const UserModel = mongoose.model("User", userSchema)