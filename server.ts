import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json({ limit: "10mb" }));

  // Determine generations directory: use /generations if it exists (e.g., Render mounted disk), fallback to workspace-relative path
  const generationsDir = fs.existsSync("/generations")
    ? "/generations"
    : path.join(process.cwd(), "generations");

  if (!fs.existsSync(generationsDir)) {
    fs.mkdirSync(generationsDir, { recursive: true });
  }

  // Serve generated image assets statically
  app.use("/generations", express.static(generationsDir));

  // API Route: Get Config (exposes API key securely for frontend generation)
  app.get("/api/config", (req, res) => {
    res.json({ apiKey: process.env.GEMINI_API_KEY });
  });

  // API Route: Save generated image base64 bytes to disk
  app.post("/api/save-generated-image", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing image data" });
      }

      const filename = `gen_${Date.now()}_${Math.floor(Math.random() * 100000)}.png`;
      const filePath = path.join(generationsDir, filename);
      const imageBuffer = Buffer.from(imageBase64, "base64");
      await fs.promises.writeFile(filePath, imageBuffer);
      
      const imageUrl = `/generations/${filename}`;
      return res.json({ success: true, imageUrl });
    } catch (error: any) {
      console.error("Error saving image:", error);
      return res.status(500).json({ error: "Save Error", message: error.message });
    }
  });

  // API Route: Upload generated image base64 bytes to GCS
  app.post("/api/upload-to-gcs", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing image data" });
      }

      const bucketName = process.env.GCS_BUCKET;
      const credentialsJSON = process.env.GCS_CREDENTIALS;

      if (!bucketName || !credentialsJSON) {
        return res.status(400).json({
          error: "Missing GCS configuration",
          message: "Please configure GCS_BUCKET and GCS_CREDENTIALS in your environment secrets."
        });
      }

      let credentials;
      try {
        credentials = JSON.parse(credentialsJSON);
      } catch (err) {
        return res.status(400).json({
          error: "Invalid Credentials JSON",
          message: "GCS_CREDENTIALS environment variable must be a valid JSON string."
        });
      }

      // Initialize GCS client
      const storage = new Storage({ credentials });
      const bucket = storage.bucket(bucketName);

      const filename = `vv_gen_${Date.now()}_${Math.floor(Math.random() * 100000)}.png`;
      const file = bucket.file(filename);

      const imageBuffer = Buffer.from(imageBase64, "base64");

      // Save file to GCS
      await file.save(imageBuffer, {
        metadata: {
          contentType: "image/png",
          cacheControl: "public, max-age=31536000",
        },
        resumable: false,
      });

      // Make the file publicly readable (optional: standard for public buckets or public URLs)
      try {
        await file.makePublic();
      } catch (pubErr) {
        console.warn("GCS makePublic failed (this is normal if bucket uniform access is enabled):", pubErr);
      }

      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      return res.json({ success: true, imageUrl: publicUrl });
    } catch (error: any) {
      console.error("Error uploading to GCS:", error);
      return res.status(500).json({ error: "Upload Error", message: error.message });
    }
  });

  // API Route: Image Generation using gemini-2.5-flash-image
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt, aspectRatio } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "Missing API Key",
          message: "Please set your Gemini API Key in the Settings > Secrets menu."
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Valid aspect ratios for gemini-2.5-flash-image and gemini-3.1-flash-image: "1:1", "3:4", "4:3", "9:16", "16:9"
      let validAspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1";
      if (["1:1", "3:4", "4:3", "9:16", "16:9"].includes(aspectRatio)) {
        validAspectRatio = aspectRatio as any;
      } else {
        // Map common ratios:
        // 4:5 -> 3:4
        if (aspectRatio === "4:5") {
          validAspectRatio = "3:4";
        }
      }

      const modelsToTry = ["gemini-2.5-flash-image", "gemini-3.1-flash-image"];
      let lastError = null;
      let imageBase64 = null;
      let textResponse = "";

      for (const modelName of modelsToTry) {
        try {
          console.log(`[Art Director Engine] Attempting image generation using model: ${modelName} with aspect ratio ${validAspectRatio}`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
            config: {
              imageConfig: {
                aspectRatio: validAspectRatio,
              },
            },
          });

          if (response.candidates && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                imageBase64 = part.inlineData.data;
              } else if (part.text) {
                textResponse += part.text;
              }
            }
          }

          if (imageBase64) {
            console.log(`[Art Director Engine] Successfully generated image with model: ${modelName}`);
            break; // Stop trying other models
          } else {
            console.warn(`[Art Director Engine] Model ${modelName} did not return image bytes. Text response: ${textResponse}`);
          }
        } catch (error: any) {
          console.error(`[Art Director Engine] Error with model ${modelName}:`, error.message || error);
          lastError = error;
        }
      }

      if (imageBase64) {
        const filename = `gen_${Date.now()}_${Math.floor(Math.random() * 100000)}.png`;
        const filePath = path.join(generationsDir, filename);
        const imageBuffer = Buffer.from(imageBase64, "base64");
        await fs.promises.writeFile(filePath, imageBuffer);
        
        const imageUrl = `/generations/${filename}`;
        return res.json({ success: true, imageUrl, textResponse });
      } else {
        const errMessage = lastError?.message || "No image data was returned by any of the model attempts.";
        return res.status(500).json({
          error: "Generation Failed",
          message: `${errMessage} ${textResponse ? `Model message: ${textResponse}` : ""}`
        });
      }
    } catch (error: any) {
      console.error("Unexpected error in /api/generate-image:", error);
      return res.status(500).json({
        error: "Generation Error",
        message: error.message || "An unexpected error occurred."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
