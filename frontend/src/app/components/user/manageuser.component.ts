import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../services/user.service';
import { User } from '../../types/user.types';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <span>Manage Users</span>
      <button matButton="filled" (click)="navigateToAddUser()">
        <mat-icon>add</mat-icon>
        Add User
      </button>
    </mat-toolbar>

    @if (isLoading) {
    <div class="loading-container">
      <mat-spinner></mat-spinner>
      <p>Loading users...</p>
    </div>
    } @else {
    <div class="table-container">
      <table mat-table [dataSource]="users" class="mat-elevation-z2">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let user">{{ user.id }}</td>
        </ng-container>

        <ng-container matColumnDef="fullName">
          <th mat-header-cell *matHeaderCellDef>Full Name</th>
          <td mat-cell *matCellDef="let user">{{ user.fullName }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let user">{{ user.email }}</td>
        </ng-container>

        <ng-container matColumnDef="phoneNumber">
          <th mat-header-cell *matHeaderCellDef>Phone</th>
          <td mat-cell *matCellDef="let user">{{ user.phoneNumber || 'N/A' }}</td>
        </ng-container>

        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef>Role</th>
          <td mat-cell *matCellDef="let user">
            <span class="role-badge" [ngClass]="'role-' + user.role.toLowerCase()">
              {{ user.role }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="isActive">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let user">
            <span
              class="status-badge"
              [ngClass]="user.isActive ? 'status-active' : 'status-deleted'"
            >
              {{ user.isActive ? 'Active' : 'Deleted' }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="dateOfBirth">
          <th mat-header-cell *matHeaderCellDef>Date of Birth</th>
          <td mat-cell *matCellDef="let user">
            {{ user.dateOfBirth | date : 'mediumDate' }}
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let user">
            <div class="action-buttons">
              <button matIconButton matTooltip="Edit User" (click)="editUser(user)">
                <mat-icon>edit</mat-icon>
              </button>
              <button
                matIconButton
                (click)="deleteUser(user)"
                matTooltip="Delete User"
                [disabled]="user.id === currentUser?.id || !user.isActive"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      @if (users.length === 0) {
      <div class="no-data">
        <h3>No users found</h3>
        <p>Click "Add User" to create your first user.</p>
      </div>
      }
    </div>
    }
  `,
  styles: [
    `
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 24px;
        text-align: center;
      }

      .loading-container mat-spinner {
        margin-bottom: 16px;
      }

      .table-container {
        overflow-x: auto;
        margin-top: 16px;
      }

      .mat-mdc-table {
        width: 100%;
        min-width: 800px;
      }

      .action-buttons {
        display: flex;
        gap: 8px;
      }

      .role-badge {
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }

      .role-admin {
        background-color: #e8f5e8;
        color: #2e7d32;
      }

      .role-user {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      .status-badge {
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }

      .status-active {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      .status-deleted {
        background-color: #ffebee;
        color: #c62828;
      }

      .no-data {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 24px;
        text-align: center;
        color: #666;
      }

      .no-data h3 {
        margin: 0 0 8px 0;
        font-weight: 400;
      }

      .no-data p {
        margin: 0;
        opacity: 0.7;
      }

      @media (max-width: 768px) {
        .manage-users-container {
          padding: 16px;
        }

        .mat-mdc-table {
          min-width: 600px;
        }
      }
    `,
  ],
})
export class ManageUsers implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser: User | null = null;

  users: User[] = [];
  isLoading = false;
  displayedColumns: string[] = [
    'id',
    'fullName',
    'email',
    'phoneNumber',
    'role',
    'dateOfBirth',
    'isActive',
    'actions',
  ];

  ngOnInit(): void {
    this.loadUsers();
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  async loadUsers(): Promise<void> {
    this.isLoading = true;
    try {
      this.users = await this.userService.getAllUsers();
    } catch (error: any) {
      console.error('Error loading users:', error);
      alert(error?.error?.message || 'Failed to load users');
    } finally {
      this.isLoading = false;
    }
  }

  navigateToAddUser(): void {
    this.router.navigate(['/add-user']);
  }

  editUser(user: User): void {
    this.router.navigate(['/edit-user', user.id]);
  }

  async deleteUser(user: User): Promise<void> {
    if (user.role === 'Admin') {
      alert('Cannot delete admin users');
      return;
    }

    if (confirm(`Are you sure you want to delete user "${user.fullName}"?`)) {
      try {
        await this.userService.deleteUser(user.id);
        alert('User deleted successfully!');
        await this.loadUsers();
      } catch (error: any) {
        console.error('Error deleting user:', error);
        alert(error?.error?.message || 'Failed to delete user');
      }
    }
  }
}
