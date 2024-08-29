import Notification from "../models/notificationMode.js";


const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImg"
        })
        await Notification.updateMany(
            { to: userId },
            { read: true }
        );
        return res.status(200).json(notifications)
    } catch (error) {
        console.log('error in notification controller', error.message);
        return res.status(500).json({ error: "Internal server error" })
    }

}

const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({ to: userId });
        return res.status(200).json({ message: "Notifications cleared" })
    } catch (error) {
        console.log('Error in deleting notification', error.message);
        return res.status(500).json({ error: "Internal server error" })
    }
}
export {
    getNotifications,
    deleteNotifications
}