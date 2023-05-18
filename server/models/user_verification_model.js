import mongoose from "mongoose";

const Schema2 = mongoose.Schema;

const UserVerificationSchema = new Schema2({
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date,
});

const UserVerification = mongoose.model('UserVerification', UserVerificationSchema);

export { UserVerification };