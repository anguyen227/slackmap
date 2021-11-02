import { RequestHandler } from "express";

import Admin from "../Admin";

const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const userRecord = await Admin.bolt.client.users.info({
      user: req.body.user_id,
    });
    res.json(userRecord);
  } catch (err) {
    next(err);
  }
};

export default getUserProfile;
