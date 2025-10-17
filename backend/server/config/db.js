import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        // Connect directly to the URI, which already includes the database name
        await mongoose.connect(process.env.MONGO_URI); 
    } catch (error) {
        console.error("Error connecting to database:", error.message);
        process.exit(1);
    }
};

export default connectDB;