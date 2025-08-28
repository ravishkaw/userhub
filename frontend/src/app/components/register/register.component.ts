import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatSnackBarModule, UserFormComponent],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header style="margin-bottom: 24px;">
          <mat-card-title>Register to the Userhub</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <app-user-form
            [showRoleSelection]="false"
            [isLoading]="isLoading"
            (formSubmit)="onFormSubmit($event)"
          >
          </app-user-form>

          <div class="login-link">
            Already have an account? <a routerLink="/login">Login here</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
          url('../../assets/images/login-bg.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }

      .register-card {
        width: 100%;
        max-width: 800px;
        padding: 20px;
      }

      .login-link {
        text-align: center;
        margin-top: 20px;
      }

      .login-link a {
        color: #1976d2;
        text-decoration: none;
      }

      .login-link a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  async onFormSubmit(formData: any): Promise<void> {
    this.isLoading = true;

    try {
      await this.authService.register(formData);

      this.snackBar.open('Registration successful! Please login.', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });

      await this.router.navigate(['/login']);
    } catch (error: any) {
      const errorMessage = error.error?.message || 'Registration failed. Please try again.';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.isLoading = false;
    }
  }
}
