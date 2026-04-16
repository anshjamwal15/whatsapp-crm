import { db } from '../database/config';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';
import { UserProfile, NewUser, UserResponse, mapUserToResponse } from '../database/models/user';

export class UserService {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserResponse[]> {
    const allUsers = await db.select().from(users);
    return allUsers.map(mapUserToResponse);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserResponse | null> {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user.length > 0 ? mapUserToResponse(user[0]) : null;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserProfile | null> {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user.length > 0 ? user[0] : null;
  }

  /**
   * Create a new user
   */
  async createUser(userData: NewUser): Promise<UserResponse> {
    const result = await db.insert(users).values(userData).returning();
    return mapUserToResponse(result[0]);
  }

  /**
   * Update user
   */
  async updateUser(userId: string, userData: Partial<NewUser>): Promise<UserResponse | null> {
    const result = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, userId))
      .returning();
    return result.length > 0 ? mapUserToResponse(result[0]) : null;
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, userId)).returning();
    return result.length > 0;
  }
}

export const userService = new UserService();
