import { Router } from "express";
import { healthCheck } from "../controllers/health.controller.js";

const healthRoutes = Router();

healthRoutes.get("/", healthCheck);

export default healthRoutes;
