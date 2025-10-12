import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { RoleInstance } from '../types/RoleAttributes';

const Role = sequelize.define<RoleInstance>(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Role;
