import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { Model } from 'sequelize';
import { UserComicXRefAttributes } from '../types/UserComicXRefAttributes';

export interface UserComicXRefInstance
  extends Model<UserComicXRefAttributes>,
    UserComicXRefAttributes {}

const UserComicXRef = sequelize.define<UserComicXRefInstance>(
  'UserComicXRef',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    comicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Comics',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM('WISHLIST', 'OWNED', 'READING', 'READ'),
      allowNull: false,
      defaultValue: 'OWNED',
    },
    dateAdded: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dateStartedReading: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateFinished: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'UserComicXRefs',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'comicId'],
      },
      {
        fields: ['userId', 'status'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default UserComicXRef;
