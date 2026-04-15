import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users } from '../schema';

export type UserProfile = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export const mapUserToResponse = (user: UserProfile): UserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
