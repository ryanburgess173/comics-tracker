export interface OmnibusComicXRefAttributes {
  id?: number;
  omnibusId: number;
  comicId: number;
  orderInCollection?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Model } from 'sequelize';

export interface OmnibusComicXRefInstance
  extends Model<OmnibusComicXRefAttributes>,
    OmnibusComicXRefAttributes {}
