import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { TradePaperbackComicXRefInstance } from '../types/TradePaperbackComicXRefAttributes';

const TradePaperbackComicXRef = sequelize.define<TradePaperbackComicXRefInstance>(
  'TradePaperbackComicXRef',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tradePaperbackId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TradePaperbacks',
        key: 'id',
      },
    },
    comicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Comics',
        key: 'id',
      },
    },
    orderInCollection: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Order of the comic within this collection',
    },
  },
  {
    timestamps: true,
  }
);

export default TradePaperbackComicXRef;
