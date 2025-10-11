export interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  passwordHash: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Model } from 'sequelize';

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}
