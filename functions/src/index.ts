import * as functions from "firebase-functions";
import express from "express";

import Admin from "./Admin";

import { errorResponder } from "./middlewares/errorHandler";
import { verifyAdmin } from "./middlewares/verifyAdmin";

import sendMessage from "./controller/sendMessage";
import getUserProfile from "./controller/getUserProfile";

Admin.isInit();

const app = express();

app.use(verifyAdmin);

app.post("/message/send", sendMessage);
app.get("/user/get", getUserProfile);

app.use("", (_req, res) => {
  res.send("not found");
});

app.use(errorResponder);

export const slack = functions.https.onRequest(app);
