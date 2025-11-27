import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComicService } from './comic.service';
import { Comic, ComicCreateRequest, ComicUpdateRequest } from '../models/comic.model';
import { environment } from '../../environments/environment';

describe('ComicService', () => {
  let service: ComicService;
  let httpMock: HttpTestingController;

  const mockComic: Comic = {
    id: 1,
    title: 'Star Wars #1',
    issueNumber: 1,
    releaseDate: new Date('2015-01-14'),
    publisherId: 1,
    universeId: 1,
    description: 'Skywalker Strikes Part I',
    imageUrl: 'https://example.com/cover.jpg',
  };

  const mockComics: Comic[] = [
    mockComic,
    {
      id: 2,
      title: 'Star Wars #2',
      issueNumber: 2,
      releaseDate: new Date('2015-02-11'),
      publisherId: 1,
      universeId: 1,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ComicService],
    });
    service = TestBed.inject(ComicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getComics', () => {
    it('should retrieve comics with default pagination', (done) => {
      const mockResponse = { comics: mockComics, total: 2 };

      service.getComics().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.comics.length).toBe(2);
        expect(response.total).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}?page=1&limit=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should retrieve comics with custom pagination', (done) => {
      const mockResponse = { comics: mockComics, total: 2 };

      service.getComics(2, 5).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}?page=2&limit=5`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getComicById', () => {
    it('should retrieve a single comic by id', (done) => {
      service.getComicById(1).subscribe((comic) => {
        expect(comic).toEqual(mockComic);
        expect(comic.id).toBe(1);
        expect(comic.title).toBe('Star Wars #1');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockComic);
    });
  });

  describe('createComic', () => {
    it('should create a new comic', (done) => {
      const newComic: ComicCreateRequest = {
        title: 'Star Wars #3',
        issueNumber: 3,
        releaseDate: new Date('2015-03-11'),
        publisherId: 1,
        universeId: 1,
        description: 'Skywalker Strikes Part III',
      };

      const createdComic: Comic = {
        id: 3,
        ...newComic,
      };

      service.createComic(newComic).subscribe((comic) => {
        expect(comic).toEqual(createdComic);
        expect(comic.id).toBe(3);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newComic);
      req.flush(createdComic);
    });
  });

  describe('updateComic', () => {
    it('should update an existing comic', (done) => {
      const updateData: ComicUpdateRequest = {
        title: 'Star Wars #1 (Updated)',
        description: 'Updated description',
      };

      const updatedComic: Comic = {
        ...mockComic,
        ...updateData,
      };

      service.updateComic(1, updateData).subscribe((comic) => {
        expect(comic).toEqual(updatedComic);
        expect(comic.title).toBe('Star Wars #1 (Updated)');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedComic);
    });
  });

  describe('deleteComic', () => {
    it('should delete a comic', (done) => {
      service.deleteComic(1).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('searchComics', () => {
    it('should search comics by query', (done) => {
      const searchQuery = 'Star Wars';

      service.searchComics(searchQuery).subscribe((comics) => {
        expect(comics).toEqual(mockComics);
        expect(comics.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/search?search=Star%20Wars`);
      expect(req.request.method).toBe('GET');
      req.flush(mockComics);
    });

    it('should handle empty search results', (done) => {
      service.searchComics('nonexistent').subscribe((comics) => {
        expect(comics).toEqual([]);
        expect(comics.length).toBe(0);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/search?search=nonexistent`);
      req.flush([]);
    });
  });
});
