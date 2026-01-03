import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import adminAuthMiddleware from "../../middlewares/adminAuthMiddleware";
import { validate } from "../../middlewares/validateResponseMiddleware";
import {
  createMovieSchema,
  updateMovieSchema,
} from "../../validators/movieValidator";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  getMovieShows,
  updateMovie,
} from "../../controllers/movieController";

const movieRouter = Router();

movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.get("/:id/shows", getMovieShows);

movieRouter.post(
  "/",
  authenticate,
  adminAuthMiddleware,
  validate(createMovieSchema),
  createMovie
);

movieRouter.put(
  "/:id",
  authenticate,
  adminAuthMiddleware,
  validate(updateMovieSchema),
  updateMovie
);

movieRouter.delete("/:id", authenticate, adminAuthMiddleware, deleteMovie);

export default movieRouter;
