import { Router } from "express";
import {
  createShow,
  getAllShows,
  getShowById,
  updateShow,
  deleteShow,
} from "../../controllers/showController";
import { validate } from "../../middlewares/validateResponseMiddleware";
import {
  createShowSchema,
  updateShowSchema,
} from "../../validators/showValidator";
import { authenticate } from "../../middlewares/authMiddleware";
import adminAuthMiddleware from "../../middlewares/adminAuthMiddleware";

const showRouter = Router();

showRouter.get("/", getAllShows);
showRouter.get("/:id", getShowById);

showRouter.post(
  "/",
  authenticate,
  adminAuthMiddleware,
  validate(createShowSchema),
  createShow
);
showRouter.put(
  "/:id",
  authenticate,
  adminAuthMiddleware,
  validate(updateShowSchema),
  updateShow
);
showRouter.delete("/:id", authenticate, adminAuthMiddleware, deleteShow);

export default showRouter;
