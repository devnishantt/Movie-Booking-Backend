import BookingRepository from "../repositories/bookingRepository";
import ShowRepository from "../repositories/showRepository";
import { Booking } from "../generated/prisma/client";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../utils/errors/errorUtil";

interface CreateBookingData {
  userId: string;
  showId: string;
  seatIds: string[];
}

export default class BookingService {
  private bookingRepository: BookingRepository;
  private showRepository: ShowRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
    this.showRepository = new ShowRepository();
  }

  async createBooking(data: CreateBookingData): Promise<Booking> {
    const { userId, showId, seatIds } = data;

    const show = await this.showRepository.findWithDetails(showId);
    if (!show) {
      throw new NotFoundError("Show not found");
    }

    if (seatIds.length === 0) {
      throw new BadRequestError("At least one seat must be selected");
    }

    if (show.availableSeats < seatIds.length) {
      throw new BadRequestError(
        `Only ${show.availableSeats} seats available for this show`
      );
    }

    const totalAmount = show.price * seatIds.length;

    return await this.bookingRepository.createWithSeats({
      userId,
      showId,
      seatIds,
      totalAmount,
    });
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await this.bookingRepository.findByUserId(userId);
  }

  async getBookingById(id: string, userId: string): Promise<Booking | null> {
    const booking = await this.bookingRepository.findWithDetails(id);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError("You can only view your own bookings");
    }

    return booking;
  }

  async cancelBooking(id: string, userId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);

    if (booking.userId !== userId) {
      throw new ForbiddenError("You can only cancel your own bookings");
    }

    if (booking.status === "CANCELLED") {
      throw new BadRequestError("Booking is already cancelled");
    }

    return await this.bookingRepository.cancelBooking(id);
  }

  async getBookedSeatsForShow(showId: string): Promise<string[]> {
    return await this.bookingRepository.getBookedSeatsForShow(showId);
  }
}
