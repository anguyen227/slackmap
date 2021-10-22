import Firebase from "../firebase";
import System, { SystemDTO } from "./System";
import Collection from "../enum/Collection";

export interface TeamDTO extends SystemDTO {
  teamDomain: string;
}

class Team extends System<TeamDTO> {
  _col = () =>
    Firebase.db.collection(
      Collection.Team
    ) as FirebaseFirestore.CollectionReference<TeamDTO>;

  _doc(id: string) {
    return this._col().doc(id) as FirebaseFirestore.DocumentReference<TeamDTO>;
  }
}

export default new Team();
