import { WebClient } from "@slack/web-api";
import * as functions from "firebase-functions";
import express from "express";

import Firebase from "./firebase";

import { errorResponder } from "./middleware/errorHandler";
import { verifySlack } from "./middleware/verifySlack";

import { ErrorCode } from "./enum/ErrorCode";

import ClientError from "./DTO/ClientError";
import MemberDTO from "./DTO/Member";
import TeamDTO from "./DTO/Team";
import UserDTO from "./DTO/User";

Firebase.init();

const web = new WebClient(functions.config().slack.token);

const app = express();

app.use(verifySlack);

app.post("/add", async (req, res, next) => {
  try {
    const { team_id, team_domain, user_id } = req.body || {};

    if (team_id && user_id) {
      const existed = await MemberDTO.isExist(MemberDTO._doc(team_id, user_id));

      if (existed) {
        res.status(200).send("You've already been added");
      } else {
        // check team existence, add if not
        const existed = await TeamDTO.isExist(TeamDTO._doc(team_id));
        if (!existed) {
          await TeamDTO.create(
            TeamDTO._col(),
            {
              teamDomain: team_domain,
            },
            team_id
          );
        }

        // get user slack profile
        const slackResult = await web.users.profile.get({
          user: user_id,
        });
        const { email, image_1024, display_name } = slackResult.profile || {};

        // validate email to create account
        if (email) {
          // create user account
          const password = Math.random().toString(36).slice(-8);
          const userRecord = await UserDTO.createAccount(email, password);
          await UserDTO.create(
            UserDTO._col(),
            {
              teamId: team_id,
              userId: user_id,
            },
            userRecord.uid
          );
          // add member document
          await MemberDTO.create(
            MemberDTO._col(team_id),
            {
              email,
              userId: user_id,
              avatarUrl: image_1024,
              displayName: display_name,
              uid: userRecord.uid,
            },
            user_id
          );

          res.status(200).send(
            `You've successfully added to Slack Map.
                  You can log in with credential: [YOUR SLACK EMAIL]/${password}`
          );
        } else {
          throw new ClientError(400, ErrorCode.InvalidEmail);
        }
      }
    } else {
      throw new ClientError(400, ErrorCode.InvalidUserData);
    }
  } catch (err) {
    next(err);
  }
});

app.use(errorResponder);

export const slack = functions.https.onRequest(app);
