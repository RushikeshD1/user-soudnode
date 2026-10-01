import mongoose, { Schema, Document } from "mongoose";
const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    playlist: [
        {
            type: String,
            required: true
        }
    ]
}, {
    timestamps: true
});
export const User = mongoose.model("User", schema);
//# sourceMappingURL=model.js.map