import * as mongoose from "mongoose";

type Reader = {
    id: number;
    name: string
    email: string
    address: string
    phone: string
    DOB: string
    joinDate: string
}

const readerSchema = new mongoose.Schema<Reader>({
    name: {
        type: String,
        required: true,
        minlength: [3,"Name must be at least 3 characters long"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter a valid email"],
        unique: [true, "Reader already exists"],
        trim: true,
        lowercase: true,
        index: true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"fill valid email"]
    },
    phone: {
        type: String,
        required: [true,"Phone number is required"],
        minlength: [10, "Phone number must be at least 10 characters long"]
    },
    address: {
        type: String,
        required: [true,"Address number required"],
        minlength: [5, "Address must be at least 5 characters long"]
    },
    DOB: {
        type: String,
        required: true,
    },
    joinDate: {
        type: String,
        required: [true, "Please enter a valid date"],
    }
})

export const ReaderModel = mongoose.model("Reader", readerSchema)