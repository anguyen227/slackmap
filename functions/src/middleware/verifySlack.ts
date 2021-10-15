import { Request, Response, NextFunction } from "express";
import * as crypto from "crypto";
import * as functions from "firebase-functions";
import tsscmp from "tsscmp";

export const verifySlack = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slackSigningSecret = functions.config().slack.signing_secret;

    // get signature and timestamp from headers
    const requestSignature = req.headers["x-slack-signature"] as string;
    const requestTimestamp = req.headers["x-slack-request-timestamp"];

    const [version, requestHash] = requestSignature.split("=");

    const body = new URLSearchParams(req.body).toString();

    // update with slack request
    const base = `${version}:${requestTimestamp}:${body}`;

    // create HMAC hash
    const hash = crypto
      .createHmac("sha256", slackSigningSecret)
      .update(base)
      .digest("hex");

    if (tsscmp(requestHash, hash)) {
      next();
    } else {
      res.status(403).send("Could you try it harder?");
    }
  } catch (err) {
    next(err);
  }
};
