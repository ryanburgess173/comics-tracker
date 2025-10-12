import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { RolePermissionXRefInstance } from '../types/RolePermissionXRefAttributes';

const RolePermissionXRef = sequelize.define<RolePermissionXRefInstance>(
  'RolePermissionXRef',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id',
      },
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Permissions',
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
  }
);

export default RolePermissionXRef;
