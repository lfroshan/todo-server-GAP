import BaseDBService from "../BaseRepository";
import { UserProfile } from "../../database/schema/userProfile.schema";
import IProfileRepository from "../../repositoryInterface/profile/IProfileRespository";

export default class ProfileRepository extends BaseDBService<typeof UserProfile> implements IProfileRepository<typeof UserProfile> {
  constructor() {
    super(UserProfile);
  }
  // Add additional methods if requried.
};
