import { Router } from "express";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getBookedSeats,
} from "../../controllers/bookingController";
import { validate } from "../../middlewares/validateResponseMiddleware";
import { createBookingSchema } from "../../validators/bookingValidator";
import { authenticate } from "../../middlewares/authMiddleware";

const bookingRouter = Router();

bookingRouter.post(
  "/",
  authenticate,
  validate(createBookingSchema),
  createBooking
);
bookingRouter.get("/", authenticate, getUserBookings);
bookingRouter.get("/:id", authenticate, getBookingById);
bookingRouter.patch("/:id/cancel", authenticate, cancelBooking);

bookingRouter.get("/show/:showId/booked-seats", getBookedSeats);

export default bookingRouter;
