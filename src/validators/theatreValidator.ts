import { z } from "zod";

export const createTheatreSchema = z.object({
  name: z.string().min(1, "Theatre name is required"),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  totalSeats: z
    .number()
    .int()
    .positive("Total seats must be a positive integer"),
});

export const updateTheatreSchema = z.object({
  name: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  totalSeats: z.number().int().positive().optional(),
});
