import { db } from '../database/config';
import { businessMembers, users } from '../database/schema';
import { eq, and } from 'drizzle-orm';
import { userService } from './user.service';

export interface InviteMemberRequest {
  email: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
  phone?: string;
}

export interface UpdateMemberRoleRequest {
  role: 'admin' | 'member' | 'viewer';
}

export interface MemberResponse {
  id: string;
  businessId: string;
  userId: string;
  role: string;
  isDefaultWorkspace: boolean;
  joinedAt: Date;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profileImageUrl?: string;
  };
}

export const memberService = {
  /**
   * List all members of a business
   */
  async listMembers(businessId: string): Promise<MemberResponse[]> {
    try {
      const result = await db
        .select({
          id: businessMembers.id,
          businessId: businessMembers.businessId,
          userId: businessMembers.userId,
          role: businessMembers.role,
          isDefaultWorkspace: businessMembers.isDefaultWorkspace,
          joinedAt: businessMembers.joinedAt,
          status: businessMembers.status,
          userName: users.name,
          userEmail: users.email,
          userPhone: users.phone,
          userProfileImageUrl: users.profileImageUrl,
        })
        .from(businessMembers)
        .innerJoin(users, eq(businessMembers.userId, users.id))
        .where(eq(businessMembers.businessId, businessId));

      return result.map((row) => ({
        id: row.id,
        businessId: row.businessId,
        userId: row.userId,
        role: row.role,
        isDefaultWorkspace: row.isDefaultWorkspace,
        joinedAt: row.joinedAt,
        status: row.status,
        user: {
          id: row.userId,
          name: row.userName,
          email: row.userEmail,
          phone: row.userPhone ?? undefined,
          profileImageUrl: row.userProfileImageUrl ?? undefined,
        },
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to list members: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Invite/Create a new member
   * If user exists, add them to the business
   * If user doesn't exist, create them first then add to business
   */
  async inviteMember(
    businessId: string,
    invitedByUserId: string,
    data: InviteMemberRequest
  ): Promise<MemberResponse> {
    try {
      // Check if user already exists
      let userProfile = await userService.getUserByEmail(data.email);

      // If user doesn't exist, create them
      if (!userProfile) {
        // Generate a random password for new users (they should reset it)
        const tempPassword = Math.random().toString(36).slice(-12);
        const newUser = await userService.createUser({
          email: data.email,
          name: data.name,
          phone: data.phone,
          passwordHash: tempPassword,
        });
        
        // Fetch the full user profile after creation
        userProfile = await userService.getUserByEmail(newUser.email);
        
        if (!userProfile) {
          throw new Error('Failed to retrieve created user');
        }
      }

      // Check if user is already a member
      const existingMember = await db
        .select()
        .from(businessMembers)
        .where(
          and(
            eq(businessMembers.businessId, businessId),
            eq(businessMembers.userId, userProfile.id)
          )
        )
        .limit(1);

      if (existingMember && existingMember.length > 0) {
        // If member exists but is inactive, reactivate them
        if (existingMember[0].status === 'inactive') {
          const updated = await db
            .update(businessMembers)
            .set({
              status: 'active',
              role: data.role,
              updatedAt: new Date(),
            })
            .where(eq(businessMembers.id, existingMember[0].id))
            .returning();

          return {
            id: updated[0].id,
            businessId: updated[0].businessId,
            userId: updated[0].userId,
            role: updated[0].role,
            isDefaultWorkspace: updated[0].isDefaultWorkspace,
            joinedAt: updated[0].joinedAt,
            status: updated[0].status,
            user: {
              id: userProfile.id,
              name: userProfile.name,
              email: userProfile.email,
              phone: userProfile.phone ?? undefined,
              profileImageUrl: userProfile.profileImageUrl ?? undefined,
            },
          };
        }

        throw new Error('User is already a member of this business');
      }

      // Add user as business member
      const newMember = await db
        .insert(businessMembers)
        .values({
          businessId,
          userId: userProfile.id,
          role: data.role,
          invitedBy: invitedByUserId,
          status: 'active',
          isDefaultWorkspace: false,
        })
        .returning();

      if (!newMember || newMember.length === 0) {
        throw new Error('Failed to add member to business');
      }

      return {
        id: newMember[0].id,
        businessId: newMember[0].businessId,
        userId: newMember[0].userId,
        role: newMember[0].role,
        isDefaultWorkspace: newMember[0].isDefaultWorkspace,
        joinedAt: newMember[0].joinedAt,
        status: newMember[0].status,
        user: {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone ?? undefined,
          profileImageUrl: userProfile.profileImageUrl ?? undefined,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to invite member: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Change member role
   */
  async changeMemberRole(
    businessId: string,
    memberId: string,
    newRole: string
  ): Promise<MemberResponse> {
    try {
      // Verify member exists and belongs to the business
      const existingMember = await db
        .select()
        .from(businessMembers)
        .where(
          and(
            eq(businessMembers.id, memberId),
            eq(businessMembers.businessId, businessId)
          )
        )
        .limit(1);

      if (!existingMember || existingMember.length === 0) {
        throw new Error('Member not found');
      }

      // Update role
      const updated = await db
        .update(businessMembers)
        .set({
          role: newRole,
          updatedAt: new Date(),
        })
        .where(eq(businessMembers.id, memberId))
        .returning();

      // Get user details
      const userProfile = await userService.getUserByEmail(
        (await userService.getUserById(updated[0].userId))?.email || ''
      );

      if (!userProfile) {
        throw new Error('User not found');
      }

      return {
        id: updated[0].id,
        businessId: updated[0].businessId,
        userId: updated[0].userId,
        role: updated[0].role,
        isDefaultWorkspace: updated[0].isDefaultWorkspace,
        joinedAt: updated[0].joinedAt,
        status: updated[0].status,
        user: {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone ?? undefined,
          profileImageUrl: userProfile.profileImageUrl ?? undefined,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to change member role: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Disable member (soft delete)
   */
  async disableMember(businessId: string, memberId: string): Promise<void> {
    try {
      // Verify member exists and belongs to the business
      const existingMember = await db
        .select()
        .from(businessMembers)
        .where(
          and(
            eq(businessMembers.id, memberId),
            eq(businessMembers.businessId, businessId)
          )
        )
        .limit(1);

      if (!existingMember || existingMember.length === 0) {
        throw new Error('Member not found');
      }

      // Update status to inactive
      await db
        .update(businessMembers)
        .set({
          status: 'inactive',
          updatedAt: new Date(),
        })
        .where(eq(businessMembers.id, memberId));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to disable member: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Get member by ID
   */
  async getMemberById(businessId: string, memberId: string): Promise<MemberResponse | null> {
    try {
      const result = await db
        .select({
          id: businessMembers.id,
          businessId: businessMembers.businessId,
          userId: businessMembers.userId,
          role: businessMembers.role,
          isDefaultWorkspace: businessMembers.isDefaultWorkspace,
          joinedAt: businessMembers.joinedAt,
          status: businessMembers.status,
          userName: users.name,
          userEmail: users.email,
          userPhone: users.phone,
          userProfileImageUrl: users.profileImageUrl,
        })
        .from(businessMembers)
        .innerJoin(users, eq(businessMembers.userId, users.id))
        .where(
          and(
            eq(businessMembers.id, memberId),
            eq(businessMembers.businessId, businessId)
          )
        )
        .limit(1);

      if (!result || result.length === 0) {
        return null;
      }

      const row = result[0];
      return {
        id: row.id,
        businessId: row.businessId,
        userId: row.userId,
        role: row.role,
        isDefaultWorkspace: row.isDefaultWorkspace,
        joinedAt: row.joinedAt,
        status: row.status,
        user: {
          id: row.userId,
          name: row.userName,
          email: row.userEmail,
          phone: row.userPhone ?? undefined,
          profileImageUrl: row.userProfileImageUrl ?? undefined,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get member: ${error.message}`);
      }
      throw error;
    }
  },
};
