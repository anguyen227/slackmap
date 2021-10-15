import admin from "firebase-admin";

const defaultApp = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://slackmap-commit.firebaseio.com",
});

export default defaultApp;

export const firestore = defaultApp.firestore();
export const auth = defaultApp.auth();
