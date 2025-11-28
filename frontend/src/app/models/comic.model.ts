export interface Comic {
  id: number;
  title: string;
  issueNumber: number;
  releaseDate: Date;
  publisherId: number;
  universeId: number;
  runId?: number;
  description?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OwnedComic extends Comic {
  userComicData: {
    status: 'WISHLIST' | 'OWNED' | 'READING' | 'READ';
    dateAdded: Date;
    dateStartedReading?: Date;
    dateFinished?: Date;
    rating?: number;
    notes?: string;
  };
}

export interface ComicCreateRequest {
  title: string;
  issueNumber: number;
  releaseDate: Date;
  publisherId: number;
  universeId: number;
  runId?: number;
  description?: string;
  coverImageUrl?: string;
}

export interface ComicUpdateRequest {
  title?: string;
  issueNumber?: number;
  releaseDate?: Date;
  publisherId?: number;
  universeId?: number;
  runId?: number;
  description?: string;
  coverImageUrl?: string;
}
