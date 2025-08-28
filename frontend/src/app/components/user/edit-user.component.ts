import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { User, UpdateUserRequest } from '../../types/user.types';
import { Role } from '../../types/role.types';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatIconModule,
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <button matIconButton (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>Edit User</span>
    </mat-toolbar>

    @if (isLoading) {
    <div class="loading-container">
      <p>Loading user data...</p>
    </div>
    } @else {
    <div class="edit-user-container">
      <div class="readonly-info">
        <div class="info-item"><strong>Full Name:</strong> {{ user?.fullName }}</div>
        <div class="info-item"><strong>Email:</strong> {{ user?.email }}</div>
      </div>

      <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Phone Number</mat-label>
            <input matInput formControlName="phoneNumber" placeholder="Enter phone number" />
            @if (editForm.get('phoneNumber')?.hasError('pattern') &&
            editForm.get('phoneNumber')?.touched) {
            <mat-error>Phone number must contain only digits</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Date of Birth</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dateOfBirth" readonly />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            @if (editForm.get('dateOfBirth')?.hasError('futureDate') &&
            editForm.get('dateOfBirth')?.touched) {
            <mat-error>Date of birth must be in the past</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Role</mat-label>
            <mat-select formControlName="roleId">
              @for (role of roles; track role.roleId) {
              <mat-option [value]="role.roleId">{{ role.roleName }}</mat-option>
              }
            </mat-select>
            @if (editForm.get('roleId')?.invalid && editForm.get('roleId')?.touched) {
            <mat-error>Please select a role</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button matButton type="button" (click)="goBack()">Cancel</button>
          <button matButton="filled" type="submit" [disabled]="editForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Updating...' : 'Update User' }}
          </button>
        </div>
      </form>
    </div>
    }
  `,
  styles: [
    `
      .toolbar {
        display: flex;
        align-items: center;
        gap: 16px;
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

      .edit-user-container {
        padding: 24px;
        max-width: 800px;
        margin: 0 auto;
      }

      .user-card {
        width: 100%;
      }

      .readonly-info {
        background-color: #f5f5f5;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 24px;
      }

      .info-item {
        margin-bottom: 8px;
        font-size: 14px;
      }

      .info-item:last-child {
        margin-bottom: 0;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 8px;
      }

      .full-width {
        grid-column: 1 / -1;
        width: 100%;
        margin-bottom: 16px;
      }

      .half-width {
        width: 100%;
        margin-bottom: 16px;
      }

      .form-actions {
        display: flex;
        gap: 16px;
        justify-content: flex-end;
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #e0e0e0;
      }

      @media (max-width: 768px) {
        .edit-user-container {
          padding: 16px;
        }

        .form-row {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .half-width {
          grid-column: 1;
        }

        .form-actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class EditUserComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private router = inject(Router);

  editForm!: FormGroup;
  user: User | null = null;
  roles: Role[] = [];
  isLoading = false;
  isSubmitting = false;
  userId!: number;

  @Input() set id(value: number) {
    this.userId = value;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
  }

  private initializeForm(): void {
    this.editForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.pattern(/^\d+$/)]],
      dateOfBirth: ['', [this.pastDateValidator]],
      roleId: ['', [Validators.required]],
    });
  }

  private async loadData(): Promise<void> {
    this.isLoading = true;
    try {
      const [userData, rolesData] = await Promise.all([
        this.userService.getUserById(this.userId),
        this.loadRoles(),
      ]);

      this.user = userData;
      this.populateForm();
    } catch (error: any) {
      console.error('Error loading data:', error);
      alert(error?.error?.message || 'Failed to load user data');
      this.goBack();
    } finally {
      this.isLoading = false;
    }
  }

  private async loadRoles(): Promise<Role[]> {
    try {
      this.roles = await this.roleService.getAllRoles();
      return this.roles;
    } catch (error) {
      console.error('Error loading roles:', error);
      this.roles = [
        { roleId: 1, roleName: 'Admin' },
        { roleId: 2, roleName: 'User' },
      ];
      return this.roles;
    }
  }

  private populateForm(): void {
    if (this.user) {
      const userRole = this.roles.find((role) => role.roleName === this.user!.role);

      this.editForm.patchValue({
        phoneNumber: this.user.phoneNumber || '',
        dateOfBirth: this.user.dateOfBirth ? new Date(this.user.dateOfBirth) : '',
        roleId: userRole?.roleId || 2,
      });
    }
  }

  pastDateValidator(control: AbstractControl) {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const today = new Date();
      if (selectedDate >= today) {
        return { futureDate: true };
      }
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.editForm.valid) {
      this.isSubmitting = true;
      try {
        const formData: UpdateUserRequest = {};
        const phoneNumber = this.editForm.get('phoneNumber')?.value?.trim();
        if (phoneNumber) {
          formData.phoneNumber = phoneNumber;
        }

        const dateOfBirth = this.editForm.get('dateOfBirth')?.value;
        if (dateOfBirth) {
          formData.dateOfBirth = new Date(dateOfBirth).toISOString().split('T')[0];
        }

        const roleId = this.editForm.get('roleId')?.value;
        if (roleId) {
          formData.roleId = roleId;
        }

        await this.userService.updateUser(this.userId, formData);
        alert('User updated successfully!');
        this.goBack();
      } catch (error: any) {
        console.error('Error updating user:', error);
        alert(error?.error?.message || 'Failed to update user');
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/manage-users']);
  }
}
