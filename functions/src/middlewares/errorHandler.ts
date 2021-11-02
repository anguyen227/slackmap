import { ErrorRequestHandler } from "express";

export const errorResponder: ErrorRequestHandler = (error, _req, res) => {
  const err = JSON.stringify(error, null, 4);
  if (error.statusCode) {
    res.status(error.statusCode).send(err);
  } else {
    res.status(500).send(err);
  }
};
