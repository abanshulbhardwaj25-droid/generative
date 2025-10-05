const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

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

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message input" });
    }

    // Pick a random response template
    const randomTemplate = responses[Math.floor(Math.random() * responses.length)];
    
    // Replace placeholder with user message
    const botReply = randomTemplate.replace("{{msg}}", message);

    console.log(`User: ${message}`);
    console.log(`Bot: ${botReply}`);

    // Simulate 2-second delay for realism
    setTimeout(() => {
      res.status(200).json({ reply: botReply });
    }, 2000);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/api/", (req, res) => {
  console.log("DATA AARA H")
  res.json({ reply: 'DATA' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
