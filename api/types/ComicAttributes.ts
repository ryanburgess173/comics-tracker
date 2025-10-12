export interface ComicAttributes {
  id?: number;
  title: string;
  authorId?: number;
  description?: string;
  imageUrl?: string;
  pages?: number;
  publisherId?: number;
  publishedDate?: Date;
  runId?: number;
  variant?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Model } from 'sequelize';

export interface ComicInstance extends Model<ComicAttributes>, ComicAttributes {}
