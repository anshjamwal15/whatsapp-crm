import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { businesses, businessMembers } from '../schema';

export type BusinessEntity = InferSelectModel<typeof businesses>;
export type NewBusinessEntity = InferInsertModel<typeof businesses>;
export type BusinessMemberEntity = InferSelectModel<typeof businessMembers>;
export type NewBusinessMemberEntity = InferInsertModel<typeof businessMembers>;

export interface CreateBusinessRequest {
  name: string;
  businessType?: string;
  phone?: string;
  email?: string;
  timezone?: string;
  country?: string;
  currency?: string;
  logoUrl?: string;
}

export interface UpdateBusinessRequest {
  name?: string;
  businessType?: string;
  phone?: string;
  email?: string;
  timezone?: string;
  country?: string;
  currency?: string;
  logoUrl?: string;
  status?: string;
}

export interface BusinessMemberInfo {
  name: string;
  email: string;
}

export interface BusinessResponse {
  id: string;
  name: string;
  slug: string;
  businessType?: string;
  ownerUserId?: string;
  phone?: string;
  email?: string;
  timezone: string;
  country?: string;
  currency: string;
  logoUrl?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  numberOfMembers?: number;
  members?: BusinessMemberInfo[];
}

export interface BusinessMemberResponse {
  id: string;
  businessId: string;
  userId: string;
  role: string;
  isDefaultWorkspace: boolean;
  joinedAt: Date;
  status: string;
}

export const mapBusinessEntityToResponse = (business: BusinessEntity): BusinessResponse => ({
  id: business.id,
  name: business.name,
  slug: business.slug,
  businessType: business.businessType ?? undefined,
  ownerUserId: business.ownerUserId ?? undefined,
  phone: business.phone ?? undefined,
  email: business.email ?? undefined,
  timezone: business.timezone,
  country: business.country ?? undefined,
  currency: business.currency,
  logoUrl: business.logoUrl ?? undefined,
  status: business.status,
  createdAt: business.createdAt,
  updatedAt: business.updatedAt,
});

export const mapBusinessMemberToResponse = (member: BusinessMemberEntity): BusinessMemberResponse => ({
  id: member.id,
  businessId: member.businessId,
  userId: member.userId,
  role: member.role,
  isDefaultWorkspace: member.isDefaultWorkspace,
  joinedAt: member.joinedAt,
  status: member.status,
});
