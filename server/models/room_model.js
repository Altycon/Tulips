import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roomUserSchema = Schema({
    username: { type: String, required: true }
});

const chatMessageSchema = Schema({
    admin: Boolean,
    message: String,
    time: Number,
    translate: Boolean,
    translation: String,
    username: String,
});

const imageMessageSchema = Schema({
    admim: Boolean,
    imageData: String,
    time: Number,
    username: String
})

const RoomSchema = Schema({
    name: { type: String, required: true },
    passkey: { type: String, required: true },
    users: [roomUserSchema],
    messages: [chatMessageSchema],
    images: [imageMessageSchema]
});

const Room = mongoose.model('Room', RoomSchema);
export { Room };