import mongoose from "mongoose";

const connectDb = (async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected ${connect.connection.host}`);

    } catch (err) {
        console.log(`error connecting database ${err}`);
        process.exit(1)
    }
})

export default connectDb