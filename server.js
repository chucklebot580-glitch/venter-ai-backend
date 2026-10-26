
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("Steve backend is running!");
});

app.post("/ask", async (req, res) => {
  try {
    const message = req.body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Please send a message."
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: "Message is too long."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "AI service is not configured yet."
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: "You are Steve, a helpful AI voice assistant. Reply clearly and concisely.",
      input: message.trim(),
      max_output_tokens: 300
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("Steve request failed:", error.message);
    res.status(500).json({
      error: "Steve could not answer right now."
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Steve backend listening on port ${port}`);
});
