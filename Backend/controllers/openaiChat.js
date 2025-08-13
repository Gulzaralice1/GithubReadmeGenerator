// controllers/openaiChat.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ChatBot = async (req, res) => {
    try {
      const message = "hello how are you";
        // const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        const markdown = await result.response.text();

        // Return raw Markdown + flag
        return res.status(200).json({ 
            message: "Success",
            bot: markdown,
            isMarkdown: true  // Frontend will use this to parse Markdown
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = ChatBot;