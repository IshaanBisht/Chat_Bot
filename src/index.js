const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config"); // Your Mongoose model

const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files (CSS, JS, etc.)
app.use(express.static("public"));

// Routes for rendering pages
app.get("/login", (req, res) => res.render("login"));

// Route for home page (after successful login)
app.get("/home", (req, res) => res.render("home"));


app.get("/register", (req, res) => res.render("register"));

// Login user 
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email exists in the database
        const user = await collection.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Email not found" });
        }

        // Compare entered password with stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Wrong password" });
        }

        console.log("✅ Login successful:", user.email);

        res.redirect("/home"); // Redirect to home page after successful login
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




// Register User
app.post("/register", async (req, res) => {
    console.log("Received Request Body:", req.body); // Debugging log

    const { fName, lName, email, password } = req.body;

    if (!fName || !lName || !email || !password) {
        console.log("❌ Missing Field Detected");
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if the email already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            console.log("❌ Account already exists");
            return res.status(400).json({ error: "Account already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            firstName: fName,
            lastName: lName,
            email,
            password: hashedPassword,
        };

        // Create new user
        const newUser = await collection.create(userData);
        console.log("✅ User registered:", newUser);

        // Return success message
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
const port = 7000;
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});

