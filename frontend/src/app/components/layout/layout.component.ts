import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { User } from '../../types';

import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatCardModule,
    HeaderComponent,
    SidebarComponent,
    CommonModule,
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav">
        <app-sidebar />
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <app-header (sidenavToggle)="sidenav.toggle()" />
        <div class="content">
          <mat-card appearance="outlined" class="content-card">
            <router-outlet />
          </mat-card>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .layout-container {
        height: 100vh;
      }

      .sidenav {
        width: 250px;
        background-color: #fff;
        padding: 0px 8px;
      }

      .main-content {
        display: flex;
        flex-direction: column;
      }

      .content {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        background-color: #f5f5f5;
      }

      .content-card {
        background-color: #fff;
        border: 1px solid #eee;
        padding: 16px;
      }

      @media (max-width: 768px) {
        .sidenav {
          width: 200px;
        }
      }
    `,
  ],
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  currentUser: User | null = null;

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
