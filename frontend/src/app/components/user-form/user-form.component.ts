import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
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

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div class="form-row">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="fullName" placeholder="Enter full name" />
          @if (userForm.get('fullName')?.invalid && userForm.get('fullName')?.touched) {
          <mat-error>Full name is required</mat-error>
          }
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="Enter email" />
          @if (userForm.get('email')?.hasError('required') && userForm.get('email')?.touched) {
          <mat-error>Email is required</mat-error>
          } @if (userForm.get('email')?.hasError('email') && userForm.get('email')?.touched) {
          <mat-error>Please enter a valid email address</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Phone Number</mat-label>
          <input matInput formControlName="phoneNumber" placeholder="Enter phone number" />
          @if (userForm.get('phoneNumber')?.hasError('required') &&
          userForm.get('phoneNumber')?.touched) {
          <mat-error>Phone number is required</mat-error>
          } @if (userForm.get('phoneNumber')?.hasError('pattern') &&
          userForm.get('phoneNumber')?.touched) {
          <mat-error>Phone number must contain only digits</mat-error>
          }
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" placeholder="Enter password" />
          @if (userForm.get('password')?.hasError('required') && userForm.get('password')?.touched)
          {
          <mat-error>Password is required</mat-error>
          } @if (userForm.get('password')?.hasError('minlength') &&
          userForm.get('password')?.touched) {
          <mat-error>Password must be at least 8 characters long</mat-error>
          } @if (userForm.get('password')?.hasError('pattern') && userForm.get('password')?.touched)
          {
          <mat-error>Password must contain both letters and numbers</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Confirm Password</mat-label>
          <input
            matInput
            type="password"
            formControlName="confirmPassword"
            placeholder="Confirm password"
          />
          @if (userForm.get('confirmPassword')?.hasError('required') &&
          userForm.get('confirmPassword')?.touched) {
          <mat-error>Please confirm your password</mat-error>
          } @if (userForm.hasError('passwordMismatch') && userForm.get('confirmPassword')?.touched)
          {
          <mat-error>Passwords do not match</mat-error>
          }
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Date of Birth</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dateOfBirth" readonly />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          @if (userForm.get('dateOfBirth')?.hasError('required') &&
          userForm.get('dateOfBirth')?.touched) {
          <mat-error>Date of birth is required</mat-error>
          } @if (userForm.get('dateOfBirth')?.hasError('futureDate') &&
          userForm.get('dateOfBirth')?.touched) {
          <mat-error>Date of birth must be in the past</mat-error>
          }
        </mat-form-field>

        @if (showRoleSelection) {
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="User">User</mat-option>
            <mat-option value="Admin">Admin</mat-option>
          </mat-select>
          @if (userForm.get('role')?.invalid && userForm.get('role')?.touched) {
          <mat-error>Please select a role</mat-error>
          }
        </mat-form-field>
        } @else {
        <div class="half-width"></div>
        }
      </div>

      <button
        mat-raised-button
        color="primary"
        type="submit"
        class="full-width submit-button"
        [disabled]="userForm.invalid || isLoading"
      >
        {{ isLoading ? 'Submitting...' : 'Submit' }}
      </button>
    </form>
  `,
  styles: [
    `
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

      .submit-button {
        margin-top: 16px;
        height: 48px;
        grid-column: 1 / -1;
      }

      @media (max-width: 768px) {
        .form-row {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .half-width {
          grid-column: 1;
        }
      }
    `,
  ],
})
export class UserFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);

  @Input() showRoleSelection = false;
  @Input() isLoading = false;
  @Input() initialData: any = null;

  @Output() formSubmit = new EventEmitter<any>();

  userForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.userForm = this.formBuilder.group(
      {
        fullName: [this.initialData?.fullName || '', [Validators.required]],
        email: [this.initialData?.email || '', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        phoneNumber: [
          this.initialData?.phoneNumber || '',
          [Validators.required, Validators.pattern(/^\d+$/)],
        ],
        dateOfBirth: [
          this.initialData?.dateOfBirth || '',
          [Validators.required, this.pastDateValidator],
        ],
        role: [
          this.showRoleSelection ? this.initialData?.role || 'User' : 'User',
          [Validators.required],
        ],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
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

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = { ...this.userForm.value };
      delete formData.confirmPassword;

      if (formData.dateOfBirth) {
        formData.dateOfBirth = new Date(formData.dateOfBirth).toISOString().split('T')[0];
      }

      this.formSubmit.emit(formData);
    }
  }
}
