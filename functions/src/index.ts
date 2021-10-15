import { WebClient } from "@slack/web-api";
import * as functions from "firebase-functions";
import express from "express";

import { errorResponder } from "./middleware/errorHandler";
import { verifySlack } from "./middleware/verifySlack";

import ClientError from "./DTO/ClientError";
import MemberDTO from "./DTO/Member";
import TeamDTO from "./DTO/Team";

require("./firebase");

const web = new WebClient(functions.config().slack.token);

const app = express();

app.use(verifySlack);

app.post("/add", async (req, res, next) => {
  try {
    const { team_id, team_domain, user_id } = req.body || {};

    if (team_id && user_id) {
      const existed = await MemberDTO.isExist(team_id, user_id);

      if (existed) {
        res.status(200).send("You've already been added");
      } else {
        // check team existence
        await TeamDTO.isExist(team_id, {
          team_id,
          team_domain,
        });

        // get user slack profile
        const slackResult = await web.users.profile.get({
          user: user_id,
        });
        const { email, image_1024, display_name } = slackResult.profile || {};

        // validate email to create account
        if (email) {
          const password = Math.random().toString(36).slice(-8);
          await MemberDTO.create(team_id, user_id, password, {
            email,
            user_id,
            avatar_url: image_1024,
            display_name,
          });
          res
            .status(200)
            .send(
              `You've successfully added to Slack Map.
              You can log in with credential: [YOUR SLACK EMAIL]/${password}`
            );
        } else {
          throw new ClientError(400, "invalid/slack-email");
        }

        console.log("slackResult", slackResult);
      }
    } else {
      throw new ClientError(400, "invalid/user-data");
    }
  } catch (err) {
    next(err);
  }
});

app.use(errorResponder);

export const map = functions.https.onRequest(app);
