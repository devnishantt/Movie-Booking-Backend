import { z } from "zod";

export const createBookingSchema = z.object({
  showId: z.string().uuid("Invalid show ID"),
  seatIds: z
    .array(z.string().uuid("Invalid seat ID"))
    .min(1, "At least one seat must be selected"),
});
