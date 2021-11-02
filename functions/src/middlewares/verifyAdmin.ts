import { RequestHandler } from "express";
import Admin from "../Admin";

export const verifyAdmin: RequestHandler = (_req, _res, next) => {
  if (Admin.initialized) {
    next();
  } else {
    next(new Error("Unable to initialize admin"));
  }
};
