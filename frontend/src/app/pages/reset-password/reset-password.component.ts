import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponentPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected email = signal('');
  protected loading = signal(false);
  protected errorMessage = signal<string | null>(null);
  protected successMessage = signal<string | null>(null);

  onSubmit() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (!this.email() || !this.email().includes('@')) {
      this.errorMessage.set('Please enter a valid email address.');
      return;
    }

    this.loading.set(true);

    this.authService.requestPasswordReset(this.email()).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(response.message);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Failed to send reset email. Please try again.',
        );
      },
    });
  }
}
