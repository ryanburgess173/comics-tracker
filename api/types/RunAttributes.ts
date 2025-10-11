export interface RunAttributes {
  id?: number;
  seriesName: string;
  keyAuthorId?: number;
  keyArtistId?: number;
  startDate?: Date;
  endDate?: Date;
  startIssue?: number;
  endIssue?: number;
  description?: string;
  universeId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Model } from 'sequelize';

export interface RunInstance extends Model<RunAttributes>, RunAttributes {}
