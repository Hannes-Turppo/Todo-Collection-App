import { Types } from "mongoose";

export interface ICollection {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  title: string;
}
