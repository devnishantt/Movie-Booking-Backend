import BaseRepository from "./baseRepository";
import { Booking, BookingStatus } from "../generated/prisma/client";
import prisma from "../config/databaseConfig";
import { BadRequestError } from "../utils/errors/errorUtil";

interface CreateBookingData {
  userId: string;
  showId: string;
  seatIds: string[];
  totalAmount: number;
}

export default class BookingRepository extends BaseRepository {
  constructor() {
    super("booking");
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return await this.findAll({
      where: { userId },
      orderBy: { createAt: "desc" },
      include: {
        show: {
          include: {
            movie: true,
            theatre: true,
          },
        },
        bookingSeats: {
          include: { seat: true },
        },
      },
    });
  }

  async findByShowId(showId: string): Promise<Booking[]> {
    return await this.findAll({
      where: { showId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        bookingSeats: {
          include: {
            seat: true,
          },
        },
      },
    });
  }

  async findWithDetails(id: string): Promise<Booking | null> {
    return await this.findOne(
      { id },
      {
        include: {
          show: {
            include: {
              movie: true,
              theatre: true,
            },
          },
          bookingSeats: {
            include: {
              seat: true,
            },
          },
        },
      }
    );
  }

  async createWithSeats(data: CreateBookingData): Promise<Booking> {
    const { userId, showId, seatIds, totalAmount } = data;

    try {
      const booking = await prisma.$transaction(async (tx) => {
        const existingBookings = await tx.bookingSeat.findMany({
          where: {
            seatId: { in: seatIds },
            booking: {
              showId: showId,
              status: { in: ["PENDING", "CONFIRMED"] },
            },
          },
        });
        if (existingBookings.length > 0) {
          throw new BadRequestError(
            "One or more selected seats are already booked."
          );
        }

        const newBooking = await tx.booking.create({
          data: {
            userId,
            showId,
            totalAmount,
            status: "CONFIRMED",
          },
        });

        await tx.bookingSeat.createMany({
          data: seatIds.map((seatId) => ({ bookingId: newBooking.id, seatId })),
        });

        await tx.show.update({
          where: { id: showId },
          data: {
            availableSeats: {
              decrement: seatIds.length,
            },
          },
        });

        return await tx.booking.findUnique({
          where: { id: newBooking.id },
          include: {
            show: { include: { movie: true, theatre: true } },
            bookingSeats: { include: { seat: true } },
          },
        });
      });
      if (!booking) {
        throw new Error("Failed to create booking.");
      }

      return booking;
    } catch (error) {
      throw error;
    }
  }

  async cancelBooking(bookingId: string): Promise<Booking> {
    try {
      const booking = await prisma.$transaction(async (tx) => {
        const existingBooking = await tx.booking.findUnique({
          where: { id: bookingId },
          include: {
            bookingSeats: true,
          },
        });

        if (!existingBooking) {
          throw new BadRequestError("Booking not found");
        }

        if (existingBooking.status === "CANCELLED") {
          throw new BadRequestError("Booking is already cancelled");
        }

        const updatedBooking = await tx.booking.update({
          where: { id: bookingId },
          data: { status: "CANCELLED" },
          include: {
            show: {
              include: {
                movie: true,
                theatre: true,
              },
            },
            bookingSeats: {
              include: {
                seat: true,
              },
            },
          },
        });

        await tx.show.update({
          where: { id: existingBooking.showId },
          data: {
            availableSeats: {
              increment: existingBooking.bookingSeats.length,
            },
          },
        });

        return updatedBooking;
      });

      return booking;
    } catch (error) {
      throw error;
    }
  }

  async getBookedSeatsForShow(showId: string): Promise<string[]> {
    const bookings = await prisma.bookingSeat.findMany({
      where: {
        booking: {
          showId,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      },
      select: {
        seatId: true,
      },
    });

    return bookings.map((b) => b.seatId);
  }
}
