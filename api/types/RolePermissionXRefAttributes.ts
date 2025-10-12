import { Model } from 'sequelize';

export interface RolePermissionXRefAttributes {
  id?: number;
  roleId: number;
  permissionId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RolePermissionXRefInstance
  extends Model<RolePermissionXRefAttributes>,
    RolePermissionXRefAttributes {}
