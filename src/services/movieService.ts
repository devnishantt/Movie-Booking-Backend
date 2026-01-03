import { Movie } from "../generated/prisma/client";
import { MovieStatus } from "../generated/prisma/enums";
import MovieRepository from "../repositories/movieRepository";

interface CreateMovieData {
  title: string;
  description: string;
  duration: number;
  language: string;
  director: string;
  genre: string;
  releaseDate: Date;
  posterUrl?: string | undefined;
  trailerUrl?: string | undefined;
  status?: MovieStatus | undefined;
}

interface UpdateMovieData {
  title?: string | undefined;
  description?: string | undefined;
  duration?: number | undefined;
  language?: string | undefined;
  director?: string | undefined;
  genre?: string | undefined;
  releaseDate?: Date | undefined;
  posterUrl?: string | undefined;
  trailerUrl?: string | undefined;
  status?: MovieStatus | undefined;
}

interface MovieFilters {
  status?: MovieStatus;
  genre?: string;
  language?: string;
}

export default class MovieService {
  private movieRepository: MovieRepository;
  constructor() {
    this.movieRepository = new MovieRepository();
  }

  async createMovie(data: CreateMovieData): Promise<Movie> {
    return await this.movieRepository.create(data);
  }

  async getAllMovies(filters?: MovieFilters): Promise<Movie[]> {
    if (filters && (filters.status || filters.genre || filters.language)) {
      return await this.movieRepository.searchMovies(filters);
    }
    return await this.movieRepository.findAll({
      orderBy: { releaseDate: "desc" },
    });
  }

  async getMovieById(id: string): Promise<Movie> {
    return await this.movieRepository.findById(id);
  }

  async getMovieWithShows(id: string): Promise<Movie | null> {
    return await this.movieRepository.findWithShows(id);
  }

  async updateMovie(id: string, data: UpdateMovieData): Promise<Movie> {
    return await this.movieRepository.update(id, data);
  }

  async deleteMovie(id: string): Promise<boolean> {
    return await this.movieRepository.delete(id);
  }
}
