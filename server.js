const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/cerebral_companions")
.then(() => {
    console.log("MongoDB Connected Successfully!");
})
.catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
});

// Mood Schema
const moodSchema = new mongoose.Schema({
    mood: String,
    note: String,
    date: {const moodSchema = new mongoose.Schema({
    mood: {
        type: String,
        required: true,
        enum: ["Great", "Okay", "Anxious", "Low", "Overwhelmed"]
    },
    date: {
        type: String,
        required: true
    },
    intensity: {
        type: Number,
        min: 0,
        max: 10
    }
});

const Mood = mongoose.model("Mood", moodSchema);
        type: Date,
        default: Date.now
    }
});

const Mood = mongoose.model("Mood", moodSchema);

// Save Mood API
// Save Mood API
app.post("/api/moods", async (req, res) => {
    try {
        const { mood, date, intensity } = req.body;

        const validMoods = [
            "Great", "Okay", "Anxious", "Low", "Overwhelmed"
        ];

        if (
            !validMoods.includes(mood) ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            !Number.isInteger(intensity) ||
            intensity < 0 ||
            intensity > 10
        ) {
            return res.status(400).json({
                message: "Invalid mood entry."
            });
        }

        const savedMood = await Mood.findOneAndUpdate(
            { date: date },
            { mood, date, intensity },
            { upsert: true, new: true, runValidators: true }
        );

        res.json({
            message: "Mood saved successfully!",
            data: savedMood
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Unable to save mood."
        });
    }
});

// Demo Chatbot API
app.post("/api/chat", (req, res) => {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
        return res.status(400).json({
            reply: "Please enter a message."
        });
    }

    const text = message.toLowerCase().trim();

    let reply;

    if (text.includes("hello") || text.includes("hi")) {
        reply = "Hello! Welcome to Cerebral Companions. How are you feeling today?";
    }
    else if (text.includes("sad") || text.includes("upset")) {
        reply = "I'm sorry things feel difficult. Would you like to talk about what's bothering you?";
    }
    else if (text.includes("stress") || text.includes("anxiety")) {
        reply = "Try taking a slow, comfortable breath. You can also try the grounding exercise available on this website.";
    }
    else if (text.includes("ocd")) {
        reply = "OCD can be challenging. Learning about it and seeking guidance from an OCD-trained professional can help.";
    }
    else {
        reply = "Thank you for sharing. I'm here to help you explore general mental wellness information.";
    }

    res.json({ reply });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Cerebral Companions running at http://localhost:${PORT}`);
});