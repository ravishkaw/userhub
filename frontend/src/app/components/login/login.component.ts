import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    CommonModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card" appearance="outlined">
        <mat-card-header style="margin-bottom:24px;">
          <mat-card-title>Login to Userhub</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="Enter your email" />
              @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched)
              {
              <mat-error>Email is required</mat-error>
              } @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
              <mat-error>Please enter a valid email address</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                type="password"
                formControlName="password"
                placeholder="Enter your password"
              />
              @if (loginForm.get('password')?.hasError('required') &&
              loginForm.get('password')?.touched) {
              <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            <button
              matButton="filled"
              type="submit"
              class="full-width submit-button"
              [disabled]="loginForm.invalid || isLoading"
            >
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <div class="register-link">
            Don't have an account? <a routerLink="/register">Register here</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
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

      .login-card {
        width: 100%;
        max-width: 400px;
        padding: 20px;
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      .submit-button {
        margin-top: 16px;
        height: 48px;
      }

      .register-link {
        text-align: center;
        margin-top: 20px;
      }

      .register-link a {
        color: #1976d2;
        text-decoration: none;
      }

      .register-link a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm!: FormGroup;
  isLoading = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;

      try {
        const loginData = this.loginForm.value;
        const response = await this.authService.login(loginData);

        this.snackBar.open(`Welcome, ${response.user.fullName}!`, 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });

        await this.router.navigate(['/dashboard']);
      } catch (error: any) {
        const errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      } finally {
        this.isLoading = false;
      }
    }
  }
}
