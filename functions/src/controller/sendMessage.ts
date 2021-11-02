import { RequestHandler } from "express";

import Admin from "../Admin";

const sendMessage: RequestHandler = async (req, res, next) => {
  try {
    const mesRes = await Admin.bolt.client.chat.postMessage(req.body);
    res.json(mesRes);
  } catch (err) {
    next(err);
  }
};

export default sendMessage;
