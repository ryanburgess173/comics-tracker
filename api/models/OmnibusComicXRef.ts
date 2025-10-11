import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { OmnibusComicXRefInstance } from '../types/OmnibusComicXRefAttributes';

const OmnibusComicXRef = sequelize.define<OmnibusComicXRefInstance>(
  'OmnibusComicXRef',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    omnibusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Omnibuses',
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

export default OmnibusComicXRef;
