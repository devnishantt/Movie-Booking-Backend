import { Movie, MovieStatus } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

export default class MovieRepository extends BaseRepository<Movie> {
  constructor() {
    super("movie");
  }

  async findByStatus(status: MovieStatus): Promise<Movie[]> {
    return await this.findAll({ where: { status } });
  }

  async findByGenre(genre: string): Promise<Movie[]> {
    return await this.findAll({ where: { genre } });
  }

  async findWithShows(id: string): Promise<Movie | null> {
    return await this.findOne(
      { id },
      {
        include: {
          shows: {
            include: { theatre: true },
          },
          orderBy: {
            showTime: "asc",
          },
        },
      }
    );
  }

  async searchMovies(filters: {
    status?: MovieStatus;
    genre?: string;
    language?: string;
  }): Promise<Movie[]> {
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.genre) where.genre = filters.genre;
    if (filters.language) where.language = filters.language;

    return await this.findAll({
      where,
      orderBy: { releaseDate: "desc" },
    });
  }
}
