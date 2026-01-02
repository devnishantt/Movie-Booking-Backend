import type { Response } from "express";

export function sendSuccess(
  res: Response,
  data: any,
  message: string = "Success",
  statusCode: number = 200
) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message: string = "Error",
  statusCode: number = 500,
  errors?: any
) {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
}
