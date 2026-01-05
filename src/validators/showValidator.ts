import { z } from "zod";

export const createShowSchema = z.object({
  movieId: z.string().uuid("Invalid movie ID"),
  theatreId: z.string().uuid("Invalid theatre ID"),
  showTime: z.string().transform((val) => new Date(val)),
  price: z.number().positive("Price must be a positive number"),
});

export const updateShowSchema = z.object({
  showTime: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  price: z.number().positive().optional(),
  availableSeats: z.number().int().min(0).optional(),
});
