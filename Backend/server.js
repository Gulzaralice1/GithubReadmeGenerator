const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const readmeRoutes = require("./routes/readmeRoutes");
app.use("/api", readmeRoutes);

const chatRoutes = require("./routes/readmeRoutes");
app.use("/api", chatRoutes);

const openaiChat = require("./controllers/openaiChat");
app.use("/api/chatbot", openaiChat);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
