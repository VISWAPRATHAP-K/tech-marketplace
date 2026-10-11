import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'STORE_OWNER' | 'SUPER_ADMIN';
  storeId?: string;
  token: string;
}

@Injectable()
export class AuthService {
  // Pre-configured accounts for testing each persona immediately!
  private users: UserSession[] = [
    {
      id: 'user-customer',
      email: 'customer@techhub.com',
      name: 'Alex Johnson',
      role: 'CUSTOMER',
      token: 'jwt-token-customer-123',
    },
    {
      id: 'owner-1',
      email: 'apex@store.com',
      name: 'Rajesh Sharma',
      role: 'STORE_OWNER',
      storeId: 'store-1',
      token: 'jwt-token-store-owner-123',
    },
    {
      id: 'user-superadmin',
      email: 'admin@marketplace.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      token: 'jwt-token-superadmin-123',
    },
  ];

  constructor(private readonly supabase: SupabaseService) {}

  async login(email: string): Promise<UserSession> {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      return user;
    }

    // Default fallback user for convenient instant login
    const newUser: UserSession = {
      id: `usr-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'CUSTOMER',
      token: `jwt-token-${Date.now()}`,
    };
    this.users.push(newUser);
    return newUser;
  }

  async register(data: {
    email: string;
    name: string;
    role: 'CUSTOMER' | 'STORE_OWNER';
    phone?: string;
  }): Promise<UserSession> {
    if (this.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new BadRequestException('Email already registered');
    }

    const newUser: UserSession = {
      id: `usr-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role || 'CUSTOMER',
      storeId: data.role === 'STORE_OWNER' ? `store-${Date.now()}` : undefined,
      token: `jwt-token-${Date.now()}`,
    };

    this.users.push(newUser);
    return newUser;
  }

  async getProfile(token: string): Promise<UserSession | null> {
    return this.users.find((u) => u.token === token) || this.users[0];
  }
}
