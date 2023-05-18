import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = Schema({
    username: { type: String, required: true, index: true, unique: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    active: { type: Boolean, required: true },
    verified: { type: Boolean, required: true }
});

UserSchema.index({ username: 1, email: 1}, { unique: true });

const User = mongoose.model('User', UserSchema);

export { User };