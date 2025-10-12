export interface UniverseAttributes {
  id?: number;
  name: string;
  description?: string;
  publisherId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Model } from 'sequelize';

export interface UniverseInstance extends Model<UniverseAttributes>, UniverseAttributes {}
