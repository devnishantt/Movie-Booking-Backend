import { Router } from "express";
import {
  createTheatre,
  getAllTheatres,
  getTheatreById,
  getTheatreWithShows,
  updateTheatre,
  deleteTheatre,
} from "../../controllers/theatreController";
import { validate } from "../../middlewares/validateResponseMiddleware";
import {
  createTheatreSchema,
  updateTheatreSchema,
} from "../../validators/theatreValidator";
import { authenticate } from "../../middlewares/authMiddleware";
import adminAuthMiddleware from "../../middlewares/adminAuthMiddleware";

const theatreRouter = Router();

theatreRouter.get("/", getAllTheatres);
theatreRouter.get("/:id", getTheatreById);
theatreRouter.get("/:id/shows", getTheatreWithShows);

theatreRouter.post(
  "/",
  authenticate,
  adminAuthMiddleware,
  validate(createTheatreSchema),
  createTheatre
);
theatreRouter.put(
  "/:id",
  authenticate,
  adminAuthMiddleware,
  validate(updateTheatreSchema),
  updateTheatre
);
theatreRouter.delete("/:id", authenticate, adminAuthMiddleware, deleteTheatre);

export default theatreRouter;
