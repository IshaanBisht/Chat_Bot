const mongoose = require("mongoose");

// Async function to connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/Login-tut", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Database Connected Successfully");
    } catch (error) {
        console.error("❌ Database Connection Failed:", error);
        process.exit(1); // Exit process if database connection fails
    }
}
connectDB();

// Create Schema
const LoginSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Create Mongoose Model
const User = mongoose.model("User", LoginSchema); // "User" instead of "users"

module.exports = User;
