import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { ComicInstance } from '../types/ComicAttributes';

const Comic = sequelize.define<ComicInstance>('Comic', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pages: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  publishedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  runId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Runs',
      key: 'id',
    },
  },
  variant: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
    comment: 'Variant number (1 = Cover A/regular, 2+ = alternate covers)',
  },
});

export default Comic;
