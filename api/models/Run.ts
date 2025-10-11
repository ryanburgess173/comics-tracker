import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { RunInstance } from '../types/RunAttributes';

const Run = sequelize.define<RunInstance>(
  'Run',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    seriesName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keyAuthorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Creators',
        key: 'id',
      },
    },
    keyArtistId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Creators',
        key: 'id',
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    startIssue: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    endIssue: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    universeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Universes',
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
  }
);

export default Run;
