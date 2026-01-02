import "dotenv/config";
import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config/serverConfig";
import logger from "./config/loggerConfig";
import errHandler from "./middlewares/errHandlerMiddleware";
import apiRouter from "./routes/apiRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is live!" });
});

app.use("/api", apiRouter);

app.use(errHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on: http://localhost:${PORT}/`);
});
