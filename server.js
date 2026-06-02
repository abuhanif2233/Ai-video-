import express from "express";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.static("./"));

const OPENAI_KEY = "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";
const ELEVEN_KEY = "sk_9f0289e03d04d4477f11c4f60d1bfa363d1763172949ffa0";

// 🧠 API ROUTE
app.post("/api", async (req, res) => {
  try{
    let topic = req.body.topic;

    // OPENAI
    let aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method:"POST",
      headers:{
        "Authorization":`Bearer ${OPENAI_KEY}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        model:"gpt-4o-mini",
        messages:[
          {role:"user", content:`Write a short viral YouTube script about ${topic}`}
        ]
      })
    });

    let aiData = await aiRes.json();

    let script = aiData.choices[0].message.content;

    // ELEVENLABS
    let voiceRes = await fetch("https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL", {
      method:"POST",
      headers:{
        "xi-api-key":ELEVEN_KEY,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({ text: script })
    });

    let buffer = await voiceRes.arrayBuffer();
    fs.writeFileSync("voice.mp3", Buffer.from(buffer));

    res.json({
      script,
      audio:"/voice.mp3"
    });

  }catch(err){
    res.json({error:"Server error"});
  }
});

app.listen(3000, ()=> console.log("Server running"));
