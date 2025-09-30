export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  // Add other fields if needed
}

import { Model } from "sequelize";

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}