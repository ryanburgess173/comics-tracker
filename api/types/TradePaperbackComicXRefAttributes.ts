export interface TradePaperbackComicXRefAttributes {
  id?: number;
  tradePaperbackId: number;
  comicId: number;
  orderInCollection?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Model } from 'sequelize';

export interface TradePaperbackComicXRefInstance
  extends Model<TradePaperbackComicXRefAttributes>,
    TradePaperbackComicXRefAttributes {}
