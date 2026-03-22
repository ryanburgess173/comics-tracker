import { Comic } from '../models/comic.model';

export interface ComicsListWithTotal {
  comics: Comic[];
  total: number;
}

export interface ComicsList {
  comics: Comic[];
}
