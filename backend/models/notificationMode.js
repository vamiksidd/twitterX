import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: String,
    type: {
        type: String,
        required: true,
        enum: ['follow', 'like']
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // 604800 seconds = 7 days
const Notification = mongoose.model('Notification', notificationSchema)
export default Notification