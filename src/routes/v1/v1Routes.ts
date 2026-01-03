import { Router } from "express";
import authRouter from "./authRoutes";
import movieRouter from "./movieRoutes";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/movies", movieRouter);

export default v1Router;
