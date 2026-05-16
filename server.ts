import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON middleware
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "FitTrack AI Backend is running" });
  });

  // User Goals API
  app.post("/api/goals", (req, res) => {
    const { userId, goals } = req.body;
    // In a real app, save to Firestore: await db.collection('goals').doc(userId).set(goals);
    res.json({ success: true, message: "Goals updated successfully" });
  });

  app.get("/api/goals/:userId", (req, res) => {
    // Mock data for now
    res.json({
      weight: 80,
      goalWeight: 75,
      tdee: 2400,
      protein: 165
    });
  });

  // Nutrition Logs API
  app.post("/api/logs", (req, res) => {
    const { userId, meal } = req.body;
    res.json({ success: true, logId: "mock_log_id" });
  });

  app.get("/api/logs/:userId", (req, res) => {
    res.json({
      breakfast: [{ name: 'Oatmeal', cal: 320, pro: 12 }],
      lunch: [{ name: 'Salad', cal: 450, pro: 35 }],
    });
  });

  // Weight History API
  app.get("/api/weight/:userId", (req, res) => {
    res.json([
      { date: '2026-05-01', weight: 82.5 },
      { date: '2026-05-08', weight: 81.8 },
      { date: '2026-05-15', weight: 81.2 },
    ]);
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
