import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../types/user.types';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule, CommonModule],
  template: `
    <div class="sidenav-header">
      <h3>UserHub</h3>
    </div>

    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
        <mat-icon matListItemIcon>dashboard</mat-icon>
        <span matListItemTitle>Dashboard</span>
      </a>

      @if (isAdmin) {
      <a mat-list-item routerLink="/manage-users" routerLinkActive="active">
        <mat-icon matListItemIcon>group</mat-icon>
        <span matListItemTitle>Manage Users</span>
      </a>
      }

      <a mat-list-item routerLink="/profile" routerLinkActive="active">
        <mat-icon matListItemIcon>person</mat-icon>
        <span matListItemTitle>Profile</span>
      </a>
    </mat-nav-list>
  `,
  styles: [
    `
      .sidenav-header {
        padding: 20px 16px;
        text-align: center;
      }

      .sidenav-header h3 {
        margin: 0;
        font-weight: 500;
      }

      a.mat-mdc-list-item.active {
        background-color: #1976d2 !important;
        color: #ffffff !important;
      }

      a.mat-mdc-list-item.active .mat-mdc-list-item-title,
      a.mat-mdc-list-item.active .mat-icon {
        color: #ffffff !important;
      }
    `,
  ],
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);

  currentUser: User | null = null;
  isAdmin = false;

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'Admin';
    });
  }
}
