import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { User } from '../../types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatSnackBarModule, CommonModule],
  template: `
    <div class="profile">
      <h1>Profile</h1>

      @if (currentUser) {

      <mat-card-title>User Information</mat-card-title>

      <div class="profile-field">
        <label>Full Name:</label>
        <span>{{ currentUser.fullName }}</span>
      </div>

      <div class="profile-field">
        <label>Email:</label>
        <span>{{ currentUser.email }}</span>
      </div>

      <div class="profile-field">
        <label>Role:</label>
        <span class="role-badge">{{ currentUser.role }}</span>
      </div>

      @if (currentUser.phoneNumber) {
      <div class="profile-field">
        <label>Phone Number:</label>
        <span>{{ currentUser.phoneNumber }}</span>
      </div>
      } @if (currentUser.dateOfBirth) {
      <div class="profile-field">
        <label>Date of Birth:</label>
        <span>{{ formatDate(currentUser.dateOfBirth) }}</span>
      </div>
      }} @if (isLoading) {
      <p>Loading...</p>
      }
    </div>
  `,
  styles: [
    `
      .profile {
        max-width: 800px;
        margin: 0 auto;
      }

      .profile h1 {
        color: #1976d2;
        margin-bottom: 24px;
      }

      .profile-card,
      .loading-card {
        margin-bottom: 20px;
      }

      .profile-field {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #e0e0e0;
      }

      .profile-field:last-child {
        border-bottom: none;
      }

      .profile-field label {
        font-weight: 500;
        color: #666;
        min-width: 120px;
      }

      .profile-field span {
        text-align: right;
      }

      .role-badge {
        background-color: #1976d2;
        color: white;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
      }

      @media (max-width: 600px) {
        .profile-field {
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }

        .profile-field span {
          text-align: left;
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  currentUser: User | null = null;
  isLoading = false;

  async ngOnInit(): Promise<void> {
    await this.loadUserProfile();
  }

  private async loadUserProfile(): Promise<void> {
    this.isLoading = true;

    try {
      this.currentUser = await this.authService.getMe();
      if (!this.currentUser) {
        this.currentUser = this.authService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.snackBar.open('Failed to load user profile', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.isLoading = false;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
