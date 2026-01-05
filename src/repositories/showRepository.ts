import BaseRepository from "./baseRepository";
import { Show } from "../generated/prisma/client";

export default class ShowRepository extends BaseRepository<Show> {
  constructor() {
    super("show");
  }

  async findByMovieId(movieId: string): Promise<Show[]> {
    return await this.findAll({
      where: { movieId },
      orderBy: { showTime: "asc" },
      include: {
        theatre: true,
      },
    });
  }

  async findByTheatreId(theatreId: string): Promise<Show[]> {
    return await this.findAll({
      where: { theatreId },
      orderBy: { showTime: "asc" },
      include: {
        movie: true,
      },
    });
  }

  async findWithDetails(id: string): Promise<Show | null> {
    return await this.findOne(
      { id },
      {
        include: {
          movie: true,
          theatre: true,
        },
      }
    );
  }

  async updateAvailableSeats(
    showId: string,
    seatsToDeduct: number
  ): Promise<Show> {
    try {
      return await this.model.update({
        where: { id: showId },
        data: {
          availableSeats: {
            decrement: seatsToDeduct,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async incrementAvailableSeats(
    showId: string,
    seatsToAdd: number
  ): Promise<Show> {
    try {
      return await this.model.update({
        where: { id: showId },
        data: {
          availableSeats: {
            increment: seatsToAdd,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async searchShows(filters: {
    movieId?: string;
    theatreId?: string;
    city?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Show[]> {
    const where: any = {};

    if (filters.movieId) where.movieId = filters.movieId;
    if (filters.theatreId) where.theatreId = filters.theatreId;

    if (filters.startDate || filters.endDate) {
      where.showTime = {};
      if (filters.startDate) where.showTime.gte = filters.startDate;
      if (filters.endDate) where.showTime.lte = filters.endDate;
    }

    if (filters.city) {
      where.theatre = {
        city: filters.city,
      };
    }

    return await this.findAll({
      where,
      orderBy: { showTime: "asc" },
      include: {
        movie: true,
        theatre: true,
      },
    });
  }
}
