const express = require("express");
const router = express.Router();
const {repoInfo} = require("../controllers/readmeController");
const { chatWithGemini } = require("../controllers/chatController");
const ChatBot = require("../controllers/openaiChat"); // <-- Fix import
// POST /api/readme
router.post("/getRepoInfo",repoInfo);
router.post("/chat", chatWithGemini);
router.post("/chatbot", ChatBot); // <-- Use correct handler

module.exports = router;
