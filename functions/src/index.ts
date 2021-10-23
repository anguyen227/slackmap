import * as functions from "firebase-functions";
import express from "express";

import Admin from "./Admin";

import { errorResponder } from "./middleware/errorHandler";
import { verifySlack } from "./middleware/verifySlack";

import register from "./controller/register";

Admin.init();

const app = express();

app.use(verifySlack);

app.post("/add", register);

app.use(errorResponder);

export const slack = functions.https.onRequest(app);
