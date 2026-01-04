import { Router } from "express";
import authRouter from "./authRoutes";
import movieRouter from "./movieRoutes";
import theatreRouter from "./theatreRoutes";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/movies", movieRouter);
v1Router.use("/theatres", theatreRouter);

export default v1Router;
