import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { UniverseInstance } from '../types/UniverseAttributes';

const Universe = sequelize.define<UniverseInstance>(
  'Universe',
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
    publisherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Publishers',
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
  }
);

export default Universe;
