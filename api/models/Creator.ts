import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import { CreatorInstance } from '../types/CreatorAttributes';

const Creator = sequelize.define<CreatorInstance>(
  'Creator',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creatorType: {
      type: DataTypes.ENUM('ARTIST', 'AUTHOR'),
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deathDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'Creators',
    timestamps: true,
  }
);

export default Creator;
