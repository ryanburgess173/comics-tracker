import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import { CreatorAttributes } from '../types/CreatorAttributes';

// Define creation attributes for fields that are optional during creation
type CreatorCreationAttributes = Optional<
  CreatorAttributes,
  'id' | 'bio' | 'birthDate' | 'deathDate'
>;

const Creator = sequelize.define<Model<CreatorAttributes, CreatorCreationAttributes>>(
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
