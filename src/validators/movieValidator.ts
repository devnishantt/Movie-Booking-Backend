import { z } from "zod";
import { MovieStatus } from "../generated/prisma/enums";

export const createMovieSchema = z.object({
  title: z.string().min(1, "Movie title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.number().int().positive("Duration must be a positive integer"),
  language: z.string().min(1, "Language is required"),
  director: z.string().min(1, "Director is required"),
  genre: z.string().min(1, "Genre is required"),
  releaseDate: z.string().transform((val) => new Date(val)),
  posterUrl: z.string().url().optional(),
  trailerUrl: z.string().url().optional(),
  status: z.nativeEnum(MovieStatus).optional(),
});

export const updateMovieSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  duration: z.number().int().positive().optional(),
  language: z.string().min(1).optional(),
  director: z.string().min(1).optional(),
  genre: z.string().min(1).optional(),
  releaseDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  posterUrl: z.string().url().optional(),
  trailerUrl: z.string().url().optional(),
  status: z.nativeEnum(MovieStatus).optional(),
});
