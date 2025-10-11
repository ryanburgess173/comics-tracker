export interface OmnibusAttributes {
  id?: number;
  title: string;
  coverImageUrl?: string;
  publicationDate?: Date;
  isbn?: string;
  description?: string;
  pageCount?: number;
  publisher?: string;
  volume?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Model } from 'sequelize';

export interface OmnibusInstance extends Model<OmnibusAttributes>, OmnibusAttributes {}
