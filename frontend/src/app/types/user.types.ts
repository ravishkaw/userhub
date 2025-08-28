export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  phoneNumber: string;
  dateOfBirth: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface UpdateUserRequest {
  phoneNumber?: string;
  dateOfBirth?: string;
  roleId?: number;
}
