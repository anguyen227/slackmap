import admin from "firebase-admin";

class Firebase {
  static app: admin.app.App;
  static db: admin.firestore.Firestore;
  static auth: admin.auth.Auth;

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
  }
}

export default Firebase;
