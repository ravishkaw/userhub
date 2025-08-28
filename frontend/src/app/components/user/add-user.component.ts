import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { UserFormComponent } from './user-form.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    UserFormComponent,
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <button matIconButton (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>Add New User</span>
    </mat-toolbar>

    <div class="container">
      <app-user-form
        [showRoleSelection]="true"
        [isLoading]="isLoading"
        (formSubmit)="handleUserSubmit($event)"
      />
    </div>
  `,
  styles: [
    `
      .toolbar {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .container {
        padding: 24px;
        max-width: 800px;
        margin: 0 auto;
      }

      @media (max-width: 768px) {
        .container {
          padding: 16px;
        }
      }
    `,
  ],
})
export class AddUserComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);

  isLoading = false;

  ngOnInit(): void {
    // Any initialization logic if needed
  }

  goBack(): void {
    this.router.navigate(['/manage-users']);
  }

  async handleUserSubmit(userData: any): Promise<void> {
    this.isLoading = true;
    try {
      await this.userService.createUser(userData);
      alert('User created successfully!');
      this.router.navigate(['/manage-users']);
    } catch (error: any) {
      console.error('Error creating user:', error);
      const errorMessage = error.error?.message || 'Failed to create user. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      this.isLoading = false;
    }
  }
}
