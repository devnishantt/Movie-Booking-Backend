import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../utils/errors/errorUtil";

export default function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== "ADMIN") {
    throw new ForbiddenError("Access denied. Admin privileges required.");
  }
}
