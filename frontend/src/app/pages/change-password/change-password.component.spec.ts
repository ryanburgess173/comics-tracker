import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let activatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);

    activatedRoute = {
      queryParams: of({ token: 'test-token-123' }),
    };

    await TestBed.configureTestingModule({
      imports: [ChangePasswordComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty password signals', () => {
    expect(component['password']()).toBe('');
    expect(component['confirmPassword']()).toBe('');
  });

  it('should initialize with loading set to false', () => {
    expect(component['loading']()).toBe(false);
  });

  it('should initialize with null error and success messages', () => {
    expect(component['errorMessage']()).toBeNull();
    expect(component['successMessage']()).toBeNull();
  });

  describe('ngOnInit', () => {
    it('should extract token from query parameters', (done) => {
      fixture.detectChanges();

      setTimeout(() => {
        expect(component['token']()).toBe('test-token-123');
        done();
      }, 0);
    });

    it('should set error message if no token is provided', (done) => {
      activatedRoute.queryParams = of({});
      const newFixture = TestBed.createComponent(ChangePasswordComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      setTimeout(() => {
        expect(newComponent['errorMessage']()).toBe('Invalid or missing password reset token.');
        done();
      }, 0);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component['token'].set('test-token-123');
    });

    it('should show error if password is empty', () => {
      component['password'].set('');
      component['confirmPassword'].set('password123');
      component.onSubmit();

      expect(component['errorMessage']()).toBe('Please fill in all fields.');
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });

    it('should show error if confirmPassword is empty', () => {
      component['password'].set('password123');
      component['confirmPassword'].set('');
      component.onSubmit();

      expect(component['errorMessage']()).toBe('Please fill in all fields.');
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });

    it('should show error if passwords do not match', () => {
      component['password'].set('password123');
      component['confirmPassword'].set('password456');
      component.onSubmit();

      expect(component['errorMessage']()).toBe('Passwords do not match.');
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });

    it('should show error if password is less than 8 characters', () => {
      component['password'].set('pass12');
      component['confirmPassword'].set('pass12');
      component.onSubmit();

      expect(component['errorMessage']()).toBe('Password must be at least 8 characters long.');
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });

    it('should show error if token is missing', () => {
      component['token'].set(null);
      component['password'].set('password123');
      component['confirmPassword'].set('password123');
      component.onSubmit();

      expect(component['errorMessage']()).toBe('Invalid or missing password reset token.');
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });

    it('should clear previous error and success messages on submit', () => {
      component['errorMessage'].set('Previous error');
      component['successMessage'].set('Previous success');
      component['password'].set('password123');
      component['confirmPassword'].set('password123');
      authService.resetPassword.and.returnValue(of({ message: 'Password reset successful' }));

      component.onSubmit();

      expect(component['errorMessage']()).toBeNull();
    });

    it('should call authService.resetPassword with valid data', () => {
      const password = 'password123';
      const token = 'test-token-123';
      component['password'].set(password);
      component['confirmPassword'].set(password);
      authService.resetPassword.and.returnValue(of({ message: 'Password reset successful' }));

      component.onSubmit();

      expect(authService.resetPassword).toHaveBeenCalledWith(token, password);
    });

    it('should display success message on successful password reset', (done) => {
      const successMessage = 'Password has been reset successfully.';
      component['password'].set('password123');
      component['confirmPassword'].set('password123');
      authService.resetPassword.and.returnValue(of({ message: successMessage }));

      component.onSubmit();

      setTimeout(() => {
        expect(component['successMessage']()).toBe(successMessage);
        expect(component['loading']()).toBe(false);
        done();
      }, 0);
    });

    it('should redirect to login after successful reset', fakeAsync(() => {
      spyOn(router, 'navigate');
      component['password'].set('password123');
      component['confirmPassword'].set('password123');
      authService.resetPassword.and.returnValue(of({ message: 'Password reset successful' }));

      component.onSubmit();
      tick(3000); // Fast-forward 3 seconds

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should display error message on request failure', (done) => {
      const errorMessage = 'Invalid or expired token';
      component['password'].set('password123');
      component['confirmPassword'].set('password123');
      authService.resetPassword.and.returnValue(
        throwError(() => ({ error: { message: errorMessage } })),
      );

      component.onSubmit();

      setTimeout(() => {
        expect(component['errorMessage']()).toBe(errorMessage);
        expect(component['loading']()).toBe(false);
        done();
      }, 0);
    });

    it('should display default error message when error response has no message', (done) => {
      component['password'].set('password123');
      component['confirmPassword'].set('password123');
      authService.resetPassword.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      setTimeout(() => {
        expect(component['errorMessage']()).toBe(
          'Failed to reset password. The token may be invalid or expired.',
        );
        expect(component['loading']()).toBe(false);
        done();
      }, 0);
    });
  });

  describe('Template Rendering', () => {
    it('should render the form when no success message', () => {
      component['successMessage'].set(null);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const form = compiled.querySelector('form');

      expect(form).toBeTruthy();
    });

    it('should hide the form when success message is shown', () => {
      component['successMessage'].set('Password reset successful');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const form = compiled.querySelector('form');

      expect(form).toBeFalsy();
    });

    it('should render password input field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const passwordInput = compiled.querySelector('input#password');

      expect(passwordInput).toBeTruthy();
    });

    it('should render confirm password input field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const confirmPasswordInput = compiled.querySelector('input#confirmPassword');

      expect(confirmPasswordInput).toBeTruthy();
    });

    it('should render submit button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');

      expect(submitButton).toBeTruthy();
    });

    it('should disable inputs and button when loading', async () => {
      component['loading'].set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      const passwordInput = compiled.querySelector('input#password') as HTMLInputElement;
      const confirmPasswordInput = compiled.querySelector(
        'input#confirmPassword',
      ) as HTMLInputElement;
      const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

      expect(passwordInput?.disabled).toBe(true);
      expect(confirmPasswordInput?.disabled).toBe(true);
      expect(submitButton?.disabled).toBe(true);
    });

    it('should display error message when present', () => {
      const errorMessage = 'Test error message';
      component['errorMessage'].set(errorMessage);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const alertError = compiled.querySelector('.alert-error');

      expect(alertError).toBeTruthy();
      expect(alertError?.textContent).toContain(errorMessage);
    });

    it('should display success message when present', () => {
      const successMessage = 'Test success message';
      component['successMessage'].set(successMessage);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const alertSuccess = compiled.querySelector('.alert-success');

      expect(alertSuccess).toBeTruthy();
      expect(alertSuccess?.textContent).toContain(successMessage);
    });

    it('should display redirect message on success', () => {
      component['successMessage'].set('Password reset successful');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const redirectMessage = compiled.querySelector('.redirect-message');

      expect(redirectMessage).toBeTruthy();
      expect(redirectMessage?.textContent).toContain('Redirecting to login page');
    });

    it('should render back to login link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const backLink = compiled.querySelector('.back-to-login a');

      expect(backLink).toBeTruthy();
      expect(backLink?.textContent).toContain('Back to Login');
    });
  });
});
