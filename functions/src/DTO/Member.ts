import { firestore, auth } from "../firebase";
import System, { SystemDTO } from "./System";
import Collection from "../enum/Collection";
import ClientError from "./ClientError";

export interface MemberDTO extends Partial<SystemDTO> {
  email: string;
  user_id: string;
  avatar_url?: string;
  display_name?: string;
  uid?: string;
  geohash?: string;
  lat?: number;
  lng?: number;
}

class Member {
  _col = (teamId: string) =>
    firestore
      .collection(Collection.Team)
      .doc(teamId)
      .collection(Collection.Member);

  isExist = async (teamId: string, id: string) => {
    const member = await this._col(teamId).doc(id).get();
    if (member.exists) {
      return true;
    }
    return false;
  };

  create = async (
    teamId: string,
    id: string,
    password: string,
    memberData: MemberDTO
  ) => {
    const existed = await this.isExist(teamId, id);
    if (existed) {
      throw new ClientError(500, "user/existed");
    }

    const userRecord = await auth.createUser({
      email: memberData.email,
      //   by pass due to creating by slack email
      emailVerified: true,
      password,
    });
    return await this._col(teamId)
      .doc(id)
      .set(System.convertIn({ ...memberData, uid: userRecord.uid }));
  };
}

export default new Member();
