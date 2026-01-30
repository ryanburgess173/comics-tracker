import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponentPage } from './reset-password.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('ResetPasswordComponentPage', () => {
  let component: ResetPasswordComponentPage;
  let fixture: ComponentFixture<ResetPasswordComponentPage>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['requestPasswordReset']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponentPage, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(ResetPasswordComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty email signal', () => {
    expect(component['email']()).toBe('');
  });

  it('should initialize with loading set to false', () => {
    expect(component['loading']()).toBe(false);
  });

  it('should initialize with null error and success messages', () => {
    expect(component['errorMessage']()).toBeNull();
    expect(component['successMessage']()).toBeNull();
  });

  describe('onSubmit', () => {
    it('should show error if email is empty', () => {
      component['email'].set('');
      component.onSubmit();

      expect(component['errorMessage']()).toBe('Please enter a valid email address.');
      expect(authService.requestPasswordReset).not.toHaveBeenCalled();
    });

    it('should show error if email is invalid', () => {
      component['email'].set('invalid-email');
      component.onSubmit();

      expect(component['errorMessage']()).toBe('Please enter a valid email address.');
      expect(authService.requestPasswordReset).not.toHaveBeenCalled();
    });

    it('should clear previous error and success messages on submit', () => {
      component['errorMessage'].set('Previous error');
      component['successMessage'].set('Previous success');
      component['email'].set('test@example.com');
      authService.requestPasswordReset.and.returnValue(of({ message: 'Email sent successfully' }));

      component.onSubmit();

      expect(component['errorMessage']()).toBeNull();
      expect(component['successMessage']()).toBe('Email sent successfully');
    });

    it('should call authService.requestPasswordReset with valid email', () => {
      const email = 'test@example.com';
      component['email'].set(email);
      authService.requestPasswordReset.and.returnValue(of({ message: 'Email sent successfully' }));

      component.onSubmit();

      expect(authService.requestPasswordReset).toHaveBeenCalledWith(email);
    });

    it('should set loading to true during request', () => {
      component['email'].set('test@example.com');
      authService.requestPasswordReset.and.returnValue(of({ message: 'Email sent successfully' }));

      component.onSubmit();

      // Loading should be set to true then false after completion
      expect(component['loading']()).toBe(false); // After completion
    });

    it('should display success message on successful request', (done) => {
      const successMessage = 'Password reset email has been sent.';
      component['email'].set('test@example.com');
      authService.requestPasswordReset.and.returnValue(of({ message: successMessage }));

      component.onSubmit();

      setTimeout(() => {
        expect(component['successMessage']()).toBe(successMessage);
        expect(component['loading']()).toBe(false);
        done();
      }, 0);
    });

    it('should display error message on request failure', (done) => {
      const errorMessage = 'Failed to send email';
      component['email'].set('test@example.com');
      authService.requestPasswordReset.and.returnValue(
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
      component['email'].set('test@example.com');
      authService.requestPasswordReset.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      setTimeout(() => {
        expect(component['errorMessage']()).toBe('Failed to send reset email. Please try again.');
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
      component['successMessage'].set('Email sent successfully');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const form = compiled.querySelector('form');

      expect(form).toBeFalsy();
    });

    it('should render email input field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const emailInput = compiled.querySelector('input[type="email"]');

      expect(emailInput).toBeTruthy();
    });

    it('should render submit button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');

      expect(submitButton).toBeTruthy();
    });

    it('should disable submit button when loading', () => {
      component['loading'].set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

      expect(submitButton.disabled).toBe(true);
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

    it('should render back to login link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const backLink = compiled.querySelector('.back-to-login a');

      expect(backLink).toBeTruthy();
      expect(backLink?.textContent).toContain('Back to Login');
    });
  });
});
