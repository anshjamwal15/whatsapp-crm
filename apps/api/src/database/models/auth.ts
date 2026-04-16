import { InferSelectModel } from 'drizzle-orm';
import { users } from '../schema';

export type User = InferSelectModel<typeof users>;

// Auth Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  name: string;
  accessToken: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export const mapUserToLoginResponse = (user: User, accessToken: string): LoginResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
  accessToken,
});
