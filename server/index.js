// server/index.js (Recommended Final Code)

import 'dotenv/config'; // Loads .env variables into process.env universally
import express from "express";
import cors from "cors";
import noteRoutes from './src/routes/notesRoutes.js' // Note: Ensure the .js extension is correct here

const app = express();

// PORT is now available globally due to 'dotenv/config' at the top
const PORT = process.env.PORT || 5000; 

// --- Middleware Setup ---
app.use(express.json());

// CORS Configuration (Correct and specific)
app.use(cors(
    {
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000",
        ],
        credentials: true,
    }
));

// --- API Routes ---
app.get('/', (req, res) => {
    res.send('FOET Notes Portal API is running!');
})

// Primary Notes Routes
app.use('/api/notes', noteRoutes);

app.get("/api/message", (req, res) => {
    res.json({ message: "Hello xdCoders" })
});

// --- Server Listen ---
app.listen(PORT, "0.0.0.0", () => 
    console.log(`Server is running on http://localhost:${PORT}`)
)