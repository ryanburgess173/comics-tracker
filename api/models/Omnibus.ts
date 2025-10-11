import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { OmnibusInstance } from '../types/OmnibusAttributes';

const Omnibus = sequelize.define<OmnibusInstance>(
  'Omnibus',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coverImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    publicationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pageCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    volume: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Omnibus;
