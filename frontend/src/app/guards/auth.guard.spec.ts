import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/comics' } as RouterStateSnapshot;
  });

  it('should allow access when user is authenticated', async () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(result).toBe(true);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to login when user is not authenticated', async () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(result).toBe(false);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/comics' },
    });
  });

  it('should include returnUrl in query params when redirecting', async () => {
    authService.isAuthenticated.and.returnValue(false);
    const protectedUrl = '/comics/123';
    mockState = { url: protectedUrl } as RouterStateSnapshot;

    await TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: protectedUrl },
    });
  });
});
