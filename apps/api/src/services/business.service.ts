import { db } from '../database/config';
import { businesses, businessMembers, users } from '../database/schema';
import { eq, and } from 'drizzle-orm';
import {
  BusinessEntity,
  NewBusinessEntity,
  CreateBusinessRequest,
  UpdateBusinessRequest,
  BusinessResponse,
  mapBusinessEntityToResponse,
} from '../database/models/business';

/**
 * Generate a unique slug from business name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 150);
}

/**
 * Ensure slug is unique by appending a number if needed
 */
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db
      .select()
      .from(businesses)
      .where(eq(businesses.slug, slug))
      .limit(1);

    if (!existing || existing.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export const businessService = {
  /**
   * Create a new business
   */
  async createBusiness(
    userId: string,
    data: CreateBusinessRequest
  ): Promise<BusinessResponse> {
    try {
      // Generate unique slug
      const baseSlug = generateSlug(data.name);
      const slug = await ensureUniqueSlug(baseSlug);

      // Create business
      const newBusiness: NewBusinessEntity = {
        name: data.name,
        slug,
        businessType: data.businessType,
        ownerUserId: userId,
        phone: data.phone,
        email: data.email,
        timezone: data.timezone || 'Asia/Kolkata',
        country: data.country,
        currency: data.currency || 'INR',
        logoUrl: data.logoUrl,
        status: 'active',
      };

      const result = await db.insert(businesses).values(newBusiness).returning();

      if (!result || result.length === 0) {
        throw new Error('Failed to create business');
      }

      const business = result[0];

      // Add owner as business member with admin role
      await db.insert(businessMembers).values({
        businessId: business.id,
        userId,
        role: 'admin',
        isDefaultWorkspace: true,
        status: 'active',
      });

      return mapBusinessEntityToResponse(business);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create business: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Get business by ID
   */
  async getBusinessById(businessId: string): Promise<BusinessResponse | null> {
    try {
      const result = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, businessId))
        .limit(1);

      if (!result || result.length === 0) {
        return null;
      }

      // Get members with name and email
      const members = await db
        .select({
          name: users.name,
          email: users.email,
        })
        .from(businessMembers)
        .innerJoin(users, eq(businessMembers.userId, users.id))
        .where(
          and(
            eq(businessMembers.businessId, businessId),
            eq(businessMembers.status, 'active')
          )
        );

      const businessResponse = mapBusinessEntityToResponse(result[0]);
      businessResponse.members = members;

      return businessResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get business: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Get business by slug
   */
  async getBusinessBySlug(slug: string): Promise<BusinessResponse | null> {
    try {
      const result = await db
        .select()
        .from(businesses)
        .where(eq(businesses.slug, slug))
        .limit(1);

      if (!result || result.length === 0) {
        return null;
      }

      return mapBusinessEntityToResponse(result[0]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get business: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Get all businesses for a user
   */
  async getUserBusinesses(userId: string): Promise<BusinessResponse[]> {
    try {
      const result = await db
        .select({
          id: businesses.id,
          name: businesses.name,
          slug: businesses.slug,
          businessType: businesses.businessType,
          ownerUserId: businesses.ownerUserId,
          phone: businesses.phone,
          email: businesses.email,
          timezone: businesses.timezone,
          country: businesses.country,
          currency: businesses.currency,
          logoUrl: businesses.logoUrl,
          status: businesses.status,
          createdAt: businesses.createdAt,
          updatedAt: businesses.updatedAt,
        })
        .from(businesses)
        .innerJoin(
          businessMembers,
          and(
            eq(businessMembers.businessId, businesses.id),
            eq(businessMembers.userId, userId),
            eq(businessMembers.status, 'active')
          )
        );

      return result.map((row) =>
        mapBusinessEntityToResponse({
          id: row.id,
          name: row.name,
          slug: row.slug,
          businessType: row.businessType,
          ownerUserId: row.ownerUserId,
          phone: row.phone,
          email: row.email,
          timezone: row.timezone,
          country: row.country,
          currency: row.currency,
          logoUrl: row.logoUrl,
          status: row.status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get user businesses: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Update business
   */
  async updateBusiness(
    businessId: string,
    data: UpdateBusinessRequest
  ): Promise<BusinessResponse> {
    try {
      const updateData: Partial<BusinessEntity> = {};

      if (data.name !== undefined) {
        updateData.name = data.name;
      }
      if (data.businessType !== undefined) {
        updateData.businessType = data.businessType;
      }
      if (data.phone !== undefined) {
        updateData.phone = data.phone;
      }
      if (data.email !== undefined) {
        updateData.email = data.email;
      }
      if (data.timezone !== undefined) {
        updateData.timezone = data.timezone;
      }
      if (data.country !== undefined) {
        updateData.country = data.country;
      }
      if (data.currency !== undefined) {
        updateData.currency = data.currency;
      }
      if (data.logoUrl !== undefined) {
        updateData.logoUrl = data.logoUrl;
      }
      if (data.status !== undefined) {
        updateData.status = data.status;
      }

      updateData.updatedAt = new Date();

      const result = await db
        .update(businesses)
        .set(updateData)
        .where(eq(businesses.id, businessId))
        .returning();

      if (!result || result.length === 0) {
        throw new Error('Business not found');
      }

      return mapBusinessEntityToResponse(result[0]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update business: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Delete business (soft delete by setting status to inactive)
   */
  async deleteBusiness(businessId: string): Promise<void> {
    try {
      await db
        .update(businesses)
        .set({
          status: 'inactive',
          updatedAt: new Date(),
        })
        .where(eq(businesses.id, businessId));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete business: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Get business members
   */
  async getBusinessMembers(businessId: string) {
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
        })
        .from(businessMembers)
        .innerJoin(users, eq(businessMembers.userId, users.id))
        .where(
          and(
            eq(businessMembers.businessId, businessId),
            eq(businessMembers.status, 'active')
          )
        );

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get business members: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Check if user has access to business
   */
  async hasBusinessAccess(userId: string, businessId: string): Promise<boolean> {
    try {
      const result = await db
        .select()
        .from(businessMembers)
        .where(
          and(
            eq(businessMembers.businessId, businessId),
            eq(businessMembers.userId, userId),
            eq(businessMembers.status, 'active')
          )
        )
        .limit(1);

      return result && result.length > 0;
    } catch (error) {
      console.error('Error checking business access:', error);
      return false;
    }
  },

  /**
   * Get user role in business
   */
  async getUserRoleInBusiness(userId: string, businessId: string): Promise<string | null> {
    try {
      const result = await db
        .select()
        .from(businessMembers)
        .where(
          and(
            eq(businessMembers.businessId, businessId),
            eq(businessMembers.userId, userId),
            eq(businessMembers.status, 'active')
          )
        )
        .limit(1);

      if (!result || result.length === 0) {
        return null;
      }

      return result[0].role;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  },

  /**
   * Get all workspaces where user is owner
   */
  async getOwnerWorkspaces(userId: string): Promise<BusinessResponse[]> {
    try {
      const result = await db
        .select({
          id: businesses.id,
          name: businesses.name,
          slug: businesses.slug,
          businessType: businesses.businessType,
          ownerUserId: businesses.ownerUserId,
          phone: businesses.phone,
          email: businesses.email,
          timezone: businesses.timezone,
          country: businesses.country,
          currency: businesses.currency,
          logoUrl: businesses.logoUrl,
          status: businesses.status,
          createdAt: businesses.createdAt,
          updatedAt: businesses.updatedAt,
        })
        .from(businesses)
        .where(
          and(
            eq(businesses.ownerUserId, userId),
            eq(businesses.status, 'active')
          )
        );

      // Get member counts for all businesses
      const businessIds = result.map(b => b.id);
      const memberCounts = await db
        .select({
          businessId: businessMembers.businessId,
        })
        .from(businessMembers)
        .where(
          and(
            eq(businessMembers.status, 'active')
          )
        );

      // Count members per business
      const memberCountMap = memberCounts.reduce((acc, member) => {
        acc[member.businessId] = (acc[member.businessId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return result.map((row) => ({
        ...mapBusinessEntityToResponse({
          id: row.id,
          name: row.name,
          slug: row.slug,
          businessType: row.businessType,
          ownerUserId: row.ownerUserId,
          phone: row.phone,
          email: row.email,
          timezone: row.timezone,
          country: row.country,
          currency: row.currency,
          logoUrl: row.logoUrl,
          status: row.status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        }),
        numberOfMembers: memberCountMap[row.id] || 0,
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get owner workspaces: ${error.message}`);
      }
      throw error;
    }
  },
};
