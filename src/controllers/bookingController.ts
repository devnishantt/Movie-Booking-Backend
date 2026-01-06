import { Request, Response } from "express";
import BookingService from "../services/bookingService";
import asyncHandler from "../utils/common/asyncHandlerUtil";
import { sendSuccess } from "../utils/common/responseUtil";

const bookingService = new BookingService();

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const booking = await bookingService.createBooking({
      ...req.body,
      userId: req.user.id,
    });
    sendSuccess(res, { booking }, "Booking created successfully.", 201);
  }
);

export const getUserBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const bookings = await bookingService.getUserBookings(req.user.id);
    sendSuccess(res, { bookings }, "Bookings retrieved successfully.", 200);
  }
);

export const getBookingById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id!, req.user.id);
    sendSuccess(res, { booking }, "Booking retrieved successfully.", 200);
  }
);

export const cancelBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const booking = await bookingService.cancelBooking(id!, req.user.id);
    sendSuccess(res, { booking }, "Booking cancelled successfully.", 200);
  }
);

export const getBookedSeats = asyncHandler(
  async (req: Request, res: Response) => {
    const { showId } = req.params;
    const bookedSeatIds = await bookingService.getBookedSeatsForShow(showId!);
    sendSuccess(
      res,
      { bookedSeatIds },
      "Booked seats retrieved successfully.",
      200
    );
  }
);
