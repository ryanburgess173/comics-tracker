import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comic, ComicCreateRequest, ComicUpdateRequest } from '../models/comic.model';

@Injectable({
  providedIn: 'root',
})
export class ComicService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}`;

  /**
   * Get all comics with optional pagination
   */
  getComics(page = 1, limit = 10): Observable<{ comics: Comic[]; total: number }> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<{ comics: Comic[]; total: number }>(this.apiUrl, { params });
  }

  // Get recent releases
  getRecentReleases(): Observable<{ comics: Comic[] }> {
    return this.http.get<{ comics: Comic[] }>(`${this.apiUrl}/comics/recentReleases`);
  }

  /**
   * Get a single comic by ID
   */
  getComicById(id: number): Observable<Comic> {
    return this.http.get<Comic>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new comic
   */
  createComic(comic: ComicCreateRequest): Observable<Comic> {
    return this.http.post<Comic>(this.apiUrl, comic);
  }

  /**
   * Update an existing comic
   */
  updateComic(id: number, comic: ComicUpdateRequest): Observable<Comic> {
    return this.http.put<Comic>(`${this.apiUrl}/${id}`, comic);
  }

  /**
   * Delete a comic
   */
  deleteComic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search comics by title
   */
  searchComics(query: string): Observable<Comic[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<Comic[]>(`${this.apiUrl}/search`, { params });
  }
}
