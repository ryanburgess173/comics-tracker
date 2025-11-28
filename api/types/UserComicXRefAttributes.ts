export interface UserComicXRefAttributes {
  id?: number;
  userId: number;
  comicId: number;
  status: 'WISHLIST' | 'OWNED' | 'READING' | 'READ';
  dateAdded?: Date;
  dateStartedReading?: Date | null;
  dateFinished?: Date | null;
  rating?: number | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
