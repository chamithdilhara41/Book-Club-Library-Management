import * as mongoose from "mongoose";

type Lending = {
    bookId: mongoose.Types.ObjectId;
    readerId: mongoose.Types.ObjectId;
    lendDate: Date;
    dueDate: Date;
    returnDate?: Date;
    returned: boolean;
};

const lendingSchema = new mongoose.Schema<Lending>({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    readerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reader',
        required: true
    },
    lendDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        default: null // no required:true here
    },
    returned: {
        type: Boolean,
        default: false
    }
});

export const LendingModel = mongoose.model("Lending", lendingSchema);
