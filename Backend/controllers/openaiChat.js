// controllers/openaiChat.js
const ChatBot = async (req, res) => {
  try {
    // your chatbot logic
    res.status(200).json({ reply: "Hello from ChatBot" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = ChatBot;