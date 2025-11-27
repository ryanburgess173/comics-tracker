import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token exists', () => {
    const mockToken = 'test-jwt-token';
    authService.getToken.and.returnValue(mockToken);

    httpClient.get('/api/comics').subscribe();

    const req = httpMock.expectOne('/api/comics');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('should not add Authorization header when token does not exist', () => {
    authService.getToken.and.returnValue(null);

    httpClient.get('/api/comics').subscribe();

    const req = httpMock.expectOne('/api/comics');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should not add Authorization header for login endpoint', () => {
    const mockToken = 'test-jwt-token';
    authService.getToken.and.returnValue(mockToken);

    httpClient.post('/api/auth/login', { username: 'test', password: 'test' }).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should not add Authorization header for register endpoint', () => {
    const mockToken = 'test-jwt-token';
    authService.getToken.and.returnValue(mockToken);

    httpClient
      .post('/api/auth/register', {
        username: 'test',
        email: 'test@test.com',
        password: 'test',
      })
      .subscribe();

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should add Authorization header for protected endpoints', () => {
    const mockToken = 'test-jwt-token';
    authService.getToken.and.returnValue(mockToken);

    const endpoints = ['/api/comics', '/api/users', '/api/publishers', '/api/universes'];

    endpoints.forEach((endpoint) => {
      httpClient.get(endpoint).subscribe();
      const req = httpMock.expectOne(endpoint);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({});
    });
  });
});
