import { Model } from 'sequelize';

export interface RoleAttributes {
  id?: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleInstance extends Model<RoleAttributes>, RoleAttributes {}
