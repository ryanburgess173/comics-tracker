import { Model } from 'sequelize';

export interface UserRoleXRefAttributes {
  id?: number;
  userId: number;
  roleId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRoleXRefInstance
  extends Model<UserRoleXRefAttributes>,
    UserRoleXRefAttributes {}
