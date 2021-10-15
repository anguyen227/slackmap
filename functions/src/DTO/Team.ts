import { firestore } from "../firebase";
import System, { SystemDTO } from "./System";
import Collection from "../enum/Collection";
import ClientError from "./ClientError";

export interface TeamDTO extends Partial<SystemDTO> {
  team_id: string;
  team_domain: string;
}

class Team {
  _col = firestore.collection(Collection.Team);

  isExist = async (id: string, teamData?: TeamDTO) => {
    const team = await this._col.doc(id).get();
    if (team.exists) {
      return team;
    } else if (teamData) {
      return await this._col.doc(id).set(System.convertIn(teamData));
    }
    return Promise.reject(new ClientError(400, "team/do-not-exist"));
  };
}

export default new Team();
