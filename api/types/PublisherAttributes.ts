export interface PublisherAttributes {
  id?: number;
  name: string;
  country?: string;
  foundedYear?: number;
  website?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Model } from 'sequelize';

export interface PublisherInstance extends Model<PublisherAttributes>, PublisherAttributes {}
