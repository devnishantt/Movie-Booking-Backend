import { Request, Response } from "express";
import MovieService from "../services/movieService";
import asyncHandler from "../utils/common/asyncHandlerUtil";
import { sendSuccess } from "../utils/common/responseUtil";
import { MovieStatus } from "../generated/prisma/enums";

const movieService = new MovieService();

export const createMovie = asyncHandler(async (req: Request, res: Response) => {
  const movie = await movieService.createMovie(req.body);
  sendSuccess(res, { movie }, "Movie created successfully.", 201);
});

export const getAllMovies = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, genre, language } = req.query;

    const filters: any = {};
    if (status) filters.status = status as MovieStatus;
    if (genre) filters.genre = genre as string;
    if (language) filters.language = language as string;

    const movies = await movieService.getAllMovies(filters);
    sendSuccess(res, { movies }, "Movies retrieved successfully.", 200);
  }
);

export const getMovieById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const movie = await movieService.getMovieById(id!);
    sendSuccess(res, { movie }, "Movie retrieved successfully", 200);
  }
);

export const getMovieShows = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const movie = await movieService.getMovieWithShows(id!);
    sendSuccess(res, { movie }, "Movie shows retrieved successfully.", 200);
  }
);

export const updateMovie = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const movie = await movieService.updateMovie(id!, req.body);
  sendSuccess(res, { movie }, "Movie updated successfully.", 200);
});

export const deleteMovie = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await movieService.deleteMovie(id!);
  sendSuccess(res, null, "Movie deleted successfully.", 200);
});
