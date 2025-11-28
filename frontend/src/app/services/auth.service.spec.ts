import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest, LoginResponse, User } from '../models/user.model';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  };

  const mockLoginResponse: LoginResponse = {
    token: 'mock-jwt-token',
    user: mockUser,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check for existing token on initialization', () => {
    // Store a token before creating the service
    localStorage.setItem('auth_token', 'existing-token');

    // Destroy and recreate the TestBed to trigger constructor again
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    const newService = TestBed.inject(AuthService);

    expect(newService.getToken()).toBe('existing-token');
    expect(newService.isAuthenticated()).toBe(true);
  });

  describe('login', () => {
    it('should login user and store token', (done) => {
      const credentials: LoginRequest = {
        username: 'testuser',
        password: 'password123',
      };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
        expect(service.getToken()).toBe('mock-jwt-token');
        expect(service.getCurrentUser()).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockLoginResponse);
    });

    it('should update currentUser$ observable on login', (done) => {
      const credentials: LoginRequest = {
        username: 'testuser',
        password: 'password123',
      };

      service.currentUser$.subscribe((user) => {
        if (user) {
          expect(user).toEqual(mockUser);
          done();
        }
      });

      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockLoginResponse);
    });
  });

  describe('register', () => {
    it('should register new user and store token', (done) => {
      const userData: RegisterRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      service.register(userData).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
        expect(service.getToken()).toBe('mock-jwt-token');
        expect(service.getCurrentUser()).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush(mockLoginResponse);
    });
  });

  describe('logout', () => {
    it('should clear token and current user', () => {
      // First login
      localStorage.setItem('auth_token', 'mock-token');

      service.logout();

      expect(service.getToken()).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should update currentUser$ observable to null', (done) => {
      // Set up initial state
      localStorage.setItem('auth_token', 'mock-token');

      service.logout();

      service.currentUser$.subscribe((user) => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('auth_token', 'test-token');
      expect(service.getToken()).toBe('test-token');
    });

    it('should return null if no token exists', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getToken (SSR)', () => {
    let ssrService: AuthService;

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthService, { provide: PLATFORM_ID, useValue: 'server' }],
      });
      ssrService = TestBed.inject(AuthService);
    });

    it('should return null when not in browser platform (SSR)', () => {
      expect(ssrService.getToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('auth_token', 'test-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', (done) => {
      service
        .login({
          username: 'testuser',
          password: 'password123',
        })
        .subscribe(() => {
          expect(service.getCurrentUser()).toEqual(mockUser);
          done();
        });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockLoginResponse);
    });

    it('should return null when no user is logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });
  });
});
