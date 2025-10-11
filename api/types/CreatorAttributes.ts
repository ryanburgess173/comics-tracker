import { CreatorType } from './CreatorTypes';

export interface CreatorAttributes {
  id?: number;
  name: string;
  creatorType: CreatorType;
  bio?: string;
  birthDate?: Date;
  deathDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Model } from 'sequelize';

export interface CreatorInstance extends Model<CreatorAttributes>, CreatorAttributes {}
