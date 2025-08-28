import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { User } from '../../types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <mat-toolbar color="primary" class="header">
      <button matIconButton (click)="toggleSidenav()" class="menu-button">
        <mat-icon>menu</mat-icon>
      </button>

      <span class="greeting">{{ getGreeting() }}</span>

      <span class="spacer"></span>

      @if (currentUser) {
      <span class="user-info">{{ currentUser.fullName }} ({{ currentUser.role }})</span>
      }

      <button matButton="outlined" (click)="logout()">
        <mat-icon>logout</mat-icon>
        Logout
      </button>
    </mat-toolbar>
  `,
  styles: [
    `
      .header {
        position: sticky;
        top: 0;
        z-index: 1000;
        background-color: #fff;
      }

      .menu-button {
        margin-right: 16px;
      }

      .spacer {
        flex: 1;
      }

      .user-info {
        margin-right: 16px;
        font-size: 14px;
      }

      @media (max-width: 768px) {
        .user-info {
          display: none;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  @Input() currentUser: User | null = null;
  @Output() sidenavToggle = new EventEmitter<void>();

  toggleSidenav(): void {
    this.sidenavToggle.emit();
  }

  getGreeting(): string {
    const hours = new Date().getHours();
    if (hours < 12) {
      return 'Good morning';
    } else if (hours < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });
    this.router.navigate(['/login']);
  }
}
