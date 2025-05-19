import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
});

// Property table schema
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  propertyId: text("property_id").notNull().unique(),
  landlordName: text("landlord_name").notNull(),
  landlordContact: text("landlord_contact").notNull(),
  buildingSize: integer("building_size").notNull(),
  type: text("type").notNull(),
  rentOrSale: text("rent_or_sale").notNull(),
  price: text("price").notNull(),
  subDistrict: text("sub_district").notNull(),
  district: text("district").notNull(),
  province: text("province").notNull(),
  mapUrl: text("map_url").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  websiteLink: text("website_link").notNull(),
});

// Route planning history
export const routePlans = pgTable("route_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  startTime: text("start_time").notNull(),
  originLat: text("origin_lat").notNull(),
  originLng: text("origin_lng").notNull(),
  createdAt: text("created_at").notNull(),
});

// Properties included in a route plan
export const routePlanProperties = pgTable("route_plan_properties", {
  id: serial("id").primaryKey(),
  routePlanId: integer("route_plan_id").notNull(),
  propertyId: text("property_id").notNull(),
  step: integer("step").notNull(),
  estimatedArrivalTime: text("estimated_arrival_time"),
});

// Create insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users);
export const insertPropertySchema = createInsertSchema(properties);
export const insertRoutePlanSchema = createInsertSchema(routePlans);
export const insertRoutePlanPropertySchema = createInsertSchema(routePlanProperties);

// Create types using z.infer
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertRoutePlan = z.infer<typeof insertRoutePlanSchema>;
export type RoutePlan = typeof routePlans.$inferSelect;

export type InsertRoutePlanProperty = z.infer<typeof insertRoutePlanPropertySchema>;
export type RoutePlanProperty = typeof routePlanProperties.$inferSelect;
