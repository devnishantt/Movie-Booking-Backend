import { Request, Response, type NextFunction } from "express";
import { AppError } from "../utils/errors/errorUtil";
import logger from "../config/loggerConfig";
import { sendError } from "../utils/common/responseUtil";
import { NODE_ENV } from "../config/serverConfig";

export default function errHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let error = err;
  if (!(err instanceof AppError)) {
    error = new AppError(
      err.message || "Internal Server Error",
      err.statusCode || 500
    );
  }

  const { name, statusCode, details, message, stack } = error;

  logger.error(`${name || "Error"}: ${message}`, {
    details,
    statusCode,
    stack,
    method: req.method,
    url: req.originalUrl,
  });

  const errDetails =
    NODE_ENV === "development" ? { name, stack, details } : undefined;

  sendError(res, message, statusCode, errDetails);
}
