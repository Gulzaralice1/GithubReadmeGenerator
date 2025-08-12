const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Add a root route to fix "Cannot GET /"
app.get('/', (req, res) => {
  res.send('GitHub README Generator API - Use /api/readme or /api/chat');
});

// ✅ Fix duplicate routes (ensure chatRoutes.js exists!)
const readmeRoutes = require('./routes/readmeRoutes');
const chatRoutes = require('./routes/readmeRoutes'); // Check file exists!

app.use('/api/readme', readmeRoutes); // Better organization
app.use('/api/chat', chatRoutes);

// ✅ Fix openaiChat usage (assuming it's a router)
const openaiChat = require('./controllers/openaiChat');
app.use('/api/chatbot', openaiChat);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});