import { Request, Response } from "express";
import TheatreService from "../services/theatreService";
import asyncHandler from "../utils/common/asyncHandlerUtil";
import { sendSuccess } from "../utils/common/responseUtil";

const theatreService = new TheatreService();

export const createTheatre = asyncHandler(
  async (req: Request, res: Response) => {
    const theatre = await theatreService.createTheatre(req.body);
    sendSuccess(res, { theatre }, "Theatre created successfully.", 201);
  }
);

export const getAllTheatres = asyncHandler(
  async (req: Request, res: Response) => {
    const { city } = req.query;
    const theatres = await theatreService.getAllTheatres(
      city as string | undefined
    );
    sendSuccess(res, { theatres }, "Theatres retrieved successfully.", 200);
  }
);

export const getTheatreById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const theatre = await theatreService.getTheatreById(id!);
    sendSuccess(res, { theatre }, "Theatre retrieved successfully.", 200);
  }
);

export const getTheatreWithShows = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const theatre = await theatreService.getTheatreWithShows(id!);
    sendSuccess(res, { theatre }, "Theatre retrieved successfully.", 200);
  }
);

export const updateTheatre = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const theatre = await theatreService.updateTheatre(id!, req.body);
    sendSuccess(res, { theatre }, "Theatre updated successfully", 200);
  }
);

export const deleteTheatre = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await theatreService.deleteTheatre(id!);
    sendSuccess(res, null, "Theatre deleted successfully.", 200);
  }
);
