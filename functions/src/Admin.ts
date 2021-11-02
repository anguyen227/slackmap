import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { App } from "@slack/bolt";

class Admin {
  static app: typeof admin;
  static bolt: App;
  static initialized = false;

  static async init(): Promise<void> {
    return await new Promise((resolve, reject) => {
      try {
        this.bolt = new App({
          token: functions.config().slack.bot_token,
          signingSecret: functions.config().slack.signing_secret,
        });
        if (!admin.apps.length) {
          admin.initializeApp();
        }
        this.app = admin;
        this.initialized = true;
        resolve();
      } catch (e) {
        console.error(
          "Firebase admin initialization error",
          JSON.stringify(e, null, 4)
        );
        this.initialized = false;
        reject(new Error("Unable to initialize firebase admin"));
      }
    });
  }

  static async isInit() {
    if (!this.initialized) {
      console.log("Initialize firebase admin");
      return await this.init();
    }
    return;
  }
}

export default Admin;
