import admin from "firebase-admin";
import { WebClient } from "@slack/web-api";
import { App } from "@slack/bolt";
import * as functions from "firebase-functions";

class Admin {
  static app: admin.app.App;
  static db: admin.firestore.Firestore;
  static auth: admin.auth.Auth;
  static bolt: App;

  static init() {
    if (!admin.apps.length) {
      try {
        this.app = admin.initializeApp();
        this.db = this.app.firestore();
        this.auth = this.app.auth();
      } catch (e) {
        console.log("Firebase admin initialization error", e);
      }
    }

    // this.web = new WebClient(functions.config().slack.token);
    this.bolt = new App({
      token: functions.config().slack.bot_token,
      signingSecret: functions.config().slack.signing_secret,
    });
  }
}

export default Admin;
