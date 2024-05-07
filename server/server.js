import express from "express";
import { promises as fs } from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Create a variable for the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.post("/save-midi", async (req, res) => {
  const base64Data = req.body.encoded_midi;
  console.log("Received base64 data:", base64Data); // Log the base64 data
  if (!base64Data) {
    return res.status(400).send("Base64 data not provided.");
  }

  try {
    const binaryString = Buffer.from(base64Data, "base64");
    const filePath = path.join(__dirname, "downloadedMidiFile.midi");
    console.log("Writing to:", filePath); // Log the file path
    await fs.writeFile(filePath, binaryString);
    res.send("File saved successfully.");
  } catch (err) {
    console.error("Error saving file:", err);
    res.status(500).send("Failed to save the file.");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
