import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { UserRoleXRefInstance } from '../types/UserRoleXRefAttributes';

const UserRoleXRef = sequelize.define<UserRoleXRefInstance>(
  'UserRoleXRef',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
  }
);

export default UserRoleXRef;
