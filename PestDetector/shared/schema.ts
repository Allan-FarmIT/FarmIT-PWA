import { pgTable, text, serial, integer, jsonb, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pests = pgTable("pests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  treatments: jsonb("treatments").notNull().$type<{
    low: {
      organic: string;
      chemical: string;
    };
    medium: {
      organic: string;
      chemical: string;
    };
    high: {
      organic: string;
      chemical: string;
    };
  }>(),
  confidence: integer("confidence").notNull(),
});

export const agrovets = pgTable("agrovets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  contact: text("contact").notNull(),
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
});

export const farms = pgTable("farms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  boundaries: jsonb("boundaries").notNull(),
  area: numeric("area").notNull(),
  location: text("location").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").notNull(),
  name: text("name").notNull(),
  plantingDate: timestamp("planting_date").notNull(),
  indices: jsonb("indices").notNull().$type<{
    ndvi: Array<{ date: string; value: number }>;
    msavi: Array<{ date: string; value: number }>;
    reci: Array<{ date: string; value: number }>;
    ndmi: Array<{ date: string; value: number }>;
  }>(),
  soilData: jsonb("soil_data"),
});

export const insertPestSchema = createInsertSchema(pests);
export const insertAgrovetSchema = createInsertSchema(agrovets);
export const insertFarmSchema = createInsertSchema(farms);
export const insertCropSchema = createInsertSchema(crops);

export type InsertPest = z.infer<typeof insertPestSchema>;
export type Pest = typeof pests.$inferSelect;
export type Agrovet = typeof agrovets.$inferSelect;
export type Farm = typeof farms.$inferSelect;
export type Crop = typeof crops.$inferSelect;
export type Severity = 'low' | 'medium' | 'high';

export interface VegetationIndices {
  ndvi: number;
  msavi: number;
  reci: number;
  ndmi: number;
}

export interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  rainfall: number;
  windSpeed: number;
}