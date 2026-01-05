import ShowRepository from "../repositories/showRepository";
import MovieRepository from "../repositories/movieRepository";
import TheatreRepository from "../repositories/theatreRepository";
import { Show } from "../generated/prisma/client";
import { NotFoundError } from "../utils/errors/errorUtil";

interface CreateShowData {
  movieId: string;
  theatreId: string;
  showTime: Date;
  price: number;
}

interface UpdateShowData {
  showTime?: Date | undefined;
  price?: number | undefined;
  availableSeats?: number | undefined;
}

interface ShowFilters {
  movieId?: string;
  theatreId?: string;
  city?: string;
  startDate?: Date;
  endDate?: Date;
}

export default class ShowService {
  private showRepository: ShowRepository;
  private movieRepository: MovieRepository;
  private theatreRepository: TheatreRepository;

  constructor() {
    this.showRepository = new ShowRepository();
    this.movieRepository = new MovieRepository();
    this.theatreRepository = new TheatreRepository();
  }

  async createShow(data: CreateShowData): Promise<Show> {
    const movie = await this.movieRepository.findById(data.movieId);
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }

    const theatre = await this.theatreRepository.findById(data.theatreId);
    if (!theatre) {
      throw new NotFoundError("Theatre not found");
    }

    return await this.showRepository.create({
      ...data,
      availableSeats: theatre.totalSeats,
    });
  }

  async getAllShows(filters?: ShowFilters): Promise<Show[]> {
    if (filters) {
      return await this.showRepository.searchShows(filters);
    }
    return await this.showRepository.findAll({
      orderBy: { showTime: "asc" },
      include: {
        movie: true,
        theatre: true,
      },
    });
  }

  async getShowById(id: string): Promise<Show | null> {
    return await this.showRepository.findWithDetails(id);
  }

  async getShowsByMovieId(movieId: string): Promise<Show[]> {
    return await this.showRepository.findByMovieId(movieId);
  }

  async getShowsByTheatreId(theatreId: string): Promise<Show[]> {
    return await this.showRepository.findByTheatreId(theatreId);
  }

  async updateShow(id: string, data: UpdateShowData): Promise<Show> {
    return await this.showRepository.update(id, data);
  }

  async deleteShow(id: string): Promise<boolean> {
    return await this.showRepository.delete(id);
  }

  async checkAvailability(
    showId: string,
    seatsRequired: number
  ): Promise<boolean> {
    const show = await this.showRepository.findById(showId);
    return show.availableSeats >= seatsRequired;
  }
}
