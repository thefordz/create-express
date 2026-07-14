import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config.js";
import { getHealthStatus } from "../services/health.service.js";

export const healthCheck = async (_req: Request, res: Response) => {
  res.status(HTTPSTATUS.OK).json(getHealthStatus());
};
