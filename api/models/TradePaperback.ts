import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { TradePaperbackInstance } from '../types/TradePaperbackAttributes';

const TradePaperback = sequelize.define<TradePaperbackInstance>(
  'TradePaperback',
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
    publisherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Publishers',
        key: 'id',
      },
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

export default TradePaperback;
