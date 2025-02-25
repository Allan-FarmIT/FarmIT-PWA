import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/pests", async (req, res) => {
    const pests = await storage.getPests();
    res.json(pests);
  });

  app.get("/api/agrovets", async (req, res) => {
    const agrovets = await storage.getAgrovets();
    res.json(agrovets);
  });

  app.get("/api/farms", async (req, res) => {
    const farms = await storage.getFarms();
    res.json(farms);
  });

  app.post("/api/farms", async (req, res) => {
    try {
      const farm = await storage.createFarm(req.body);
      res.json(farm);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/farms/:id/crops", async (req, res) => {
    const crops = await storage.getCropsByFarmId(parseInt(req.params.id));
    res.json(crops);
  });

  app.post("/api/farms/:id/crops", async (req, res) => {
    try {
      const crop = await storage.createCrop({
        ...req.body,
        farmId: parseInt(req.params.id),
      });
      res.json(crop);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}