import { RequestHandler, Request } from "express";

import { ErrorCode } from "../enum/ErrorCode";

import ClientError from "../DTO/ClientError";
import MemberDTO from "../DTO/Member";
import TeamDTO from "../DTO/Team";
import UserDTO from "../DTO/User";

import Admin from "../Admin";

const register: RequestHandler = async (req, res, next) => {
  try {
    const { team_id, user_id } = req.body || {};

    if (team_id && user_id) {
      const existed = await MemberDTO.isExist(MemberDTO._doc(team_id, user_id));
      if (existed) {
        res.status(200).send("You've already been added");
      } else {
        res
          .status(200)
          .send("Hanging tight!!! I'm setting up account for you....");
        handleRegistration(req);
      }
    } else {
      throw new ClientError(400, ErrorCode.InvalidUserData);
    }
  } catch (err) {
    next(err);
  }
};

export default register;

const handleRegistration = async (req: Request) => {
  const { team_id, team_domain, user_id, channel_id } = req.body || {};

  try {
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
    const slackResult = await Admin.bolt.client.users.info({
      user: user_id,
    });

    const { profile, is_admin } = slackResult.user || {};
    const { email, image_1024, display_name } = profile || {};

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
          isAdmin: is_admin,
        },
        user_id
      );

      Admin.bolt.client.chat.postMessage({
        channel: channel_id,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Your Slack Map account is all set:\nCredential: *[YOUR SLACK EMAIL]/${password}*`,
            },
          },
        ],
      });
    } else {
      throw new ClientError(
        400,
        ErrorCode.InvalidEmail,
        `Sorry, we're unable to set up account with this email: ${email}`
      );
    }
  } catch (e) {
    if (e instanceof ClientError) {
      Admin.bolt.client.chat.postMessage({
        channel: channel_id,
        text: e.message,
      });
    }
  }
};
