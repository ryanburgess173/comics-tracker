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
