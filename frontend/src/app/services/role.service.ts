import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Role } from '../types/role.types';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  async getAllRoles(): Promise<Role[]> {
    try {
      return await firstValueFrom(this.http.get<Role[]>(`${this.apiUrl}/roles`));
    } catch (error) {
      throw error;
    }
  }
}
