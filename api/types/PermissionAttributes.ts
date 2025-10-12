import { Model } from 'sequelize';

export interface PermissionAttributes {
  id?: number;
  name: string;
  description?: string;
  resource: string;
  action: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PermissionInstance extends Model<PermissionAttributes>, PermissionAttributes {}
