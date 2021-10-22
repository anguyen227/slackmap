import Collection from "../enum/Collection";
import Firebase from "../firebase";
import System, { SystemDTO } from "./System";

export interface UserDTO extends SystemDTO {
  teamId: string;
  userId: string;
}

class User extends System<UserDTO> {
  _col = () =>
    Firebase.db.collection(
      Collection.User
    ) as FirebaseFirestore.CollectionReference<UserDTO>;

  _doc = (id: string) =>
    this._col().doc(id) as FirebaseFirestore.DocumentReference<UserDTO>;

  createAccount = async (email: string, password: string) => {
    return await Firebase.auth.createUser({
      email,
      emailVerified: false,
      password,
    });
  };

  getByPath = async (team: string, member: string) => {
    try {
      const doc = await Firebase.db
        .doc(`${Collection.Team}/${team}/${Collection.Member}/${member}`)
        .get();
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (e) {
      return null;
    }
  };
}

export default new User();
