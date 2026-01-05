import { Request, Response } from "express";
import ShowService from "../services/showService";
import asyncHandler from "../utils/common/asyncHandlerUtil";
import { sendSuccess } from "../utils/common/responseUtil";

const showService = new ShowService();

export const createShow = asyncHandler(async (req: Request, res: Response) => {
  const show = await showService.createShow(req.body);
  sendSuccess(res, { show }, "Show created successfully.", 201);
});

export const getAllShows = asyncHandler(async (req: Request, res: Response) => {
  const { movieId, theatreId, city, startDate, endDate } = req.query;

  const filters: any = {};
  if (movieId) filters.movieId = movieId as string;
  if (theatreId) filters.theatreId = theatreId as string;
  if (city) filters.city = city as string;
  if (startDate) filters.startDate = new Date(startDate as string);
  if (endDate) filters.endDate = new Date(endDate as string);

  const shows = await showService.getAllShows(filters);
  sendSuccess(res, { shows }, "Shows retrieved successfully.", 200);
});

export const getShowById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const show = await showService.getShowById(id!);
  sendSuccess(res, { show }, "Show retrieved successfully.", 200);
});

export const updateShow = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const show = await showService.updateShow(id!, req.body);
  sendSuccess(res, { show }, "Show updated successfully.", 200);
});

export const deleteShow = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await showService.deleteShow(id!);
  sendSuccess(res, null, "Show deleted successfully.", 200);
});