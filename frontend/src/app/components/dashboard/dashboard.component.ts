import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { User } from '../../types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  template: `
    <div class="dashboard">
      @if (currentUser) {
      <h2>Welcome, {{ currentUser.fullName }}!</h2>
      <p>
        Role: <strong>{{ currentUser.role }}</strong>
      </p>
      }
    </div>
  `,
  styles: [
    `
      .dashboard h1 {
        color: #1976d2;
        margin-bottom: 24px;
      }

      .dashboard h2 {
        color: #1976d2;
        margin-bottom: 16px;
      }

      .dashboard p {
        margin-bottom: 8px;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  currentUser: User | null = null;

  async ngOnInit(): Promise<void> {
    this.currentUser = this.authService.getCurrentUser();
  }
}
