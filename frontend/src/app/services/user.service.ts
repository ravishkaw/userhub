import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { User, UpdateUserRequest } from '../types/user.types';
import { RegisterData } from '../types/auth.types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  async getAllUsers(): Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(`${this.apiUrl}/users`));
  }

  async getUserById(id: number): Promise<User> {
    return firstValueFrom(this.http.get<User>(`${this.apiUrl}/users/${id}`));
  }

  async createUser(user: RegisterData): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/users`, user));
  }

  async updateUser(id: number, user: UpdateUserRequest): Promise<any> {
    return firstValueFrom(this.http.put(`${this.apiUrl}/users/${id}`, user));
  }

  async deleteUser(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/users/${id}`));
  }
}
