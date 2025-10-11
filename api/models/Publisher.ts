import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { PublisherInstance } from '../types/PublisherAttributes';

const Publisher = sequelize.define<PublisherInstance>(
  'Publisher',
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
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    foundedYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Publisher;
