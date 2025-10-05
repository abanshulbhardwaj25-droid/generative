import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;
import { getGroqReply } from "./groq.js";
app.use(cors());
app.use(express.json());
// Random response templates
const responses = [
  "Hmm... interesting! You mentioned '{{msg}}', right?",
  "Oh, I see you're talking about '{{msg}}'!",
  "That's a great point about '{{msg}}'.",
  "Let me think about '{{msg}}' for a moment 🤔",
  "You said '{{msg}}' — nice choice of topic!",
  "Ah yes, '{{msg}}'! That’s quite fascinating.",
  "Got it. '{{msg}}' sounds important!",
  "I totally get your point about '{{msg}}'.",
  "You're curious about '{{msg}}', right?",
  "Let's dive deeper into '{{msg}}'!"
];
// POST /api/message
app.post("/api/message", async (req, res) => {
    try {
    const { message } = req.body;
    const reply = await getGroqReply(message);
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/api/", (req, res) => {
  console.log("DATA AARA H")
  res.json({ reply: 'DATA' });
});

// GET /api/message?message=your_message
app.get("/api/message", async (req, res) => {
    try {
  
    const reply = await getGroqReply('i am anshul');
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
