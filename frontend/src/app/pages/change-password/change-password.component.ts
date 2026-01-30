import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected password = signal('');
  protected confirmPassword = signal('');
  protected loading = signal(false);
  protected errorMessage = signal<string | null>(null);
  protected successMessage = signal<string | null>(null);
  protected token = signal<string | null>(null);

  ngOnInit() {
    // Extract token from query parameters
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.token.set(token);
      } else {
        this.errorMessage.set('Invalid or missing password reset token.');
      }
    });
  }

  onSubmit() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Validation
    if (!this.password() || !this.confirmPassword()) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    if (this.password().length < 8) {
      this.errorMessage.set('Password must be at least 8 characters long.');
      return;
    }

    if (!this.token()) {
      this.errorMessage.set('Invalid or missing password reset token.');
      return;
    }

    this.loading.set(true);

    this.authService.resetPassword(this.token()!, this.password()).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(response.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Failed to reset password. The token may be invalid or expired.',
        );
      },
    });
  }
}
