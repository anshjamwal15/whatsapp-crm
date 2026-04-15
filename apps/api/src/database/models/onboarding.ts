import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { businesses, businessMembers } from '../schema';

export type Business = InferSelectModel<typeof businesses>;
export type NewBusiness = InferInsertModel<typeof businesses>;
export type BusinessMember = InferSelectModel<typeof businessMembers>;
export type NewBusinessMember = InferInsertModel<typeof businessMembers>;

// Onboarding Request/Response Types
export interface OnboardingRequest {
  businessName: string;
  businessType: string;
  industry: string;
  website?: string;
  description?: string;
  country?: string;
  timezone?: string;
  currency?: string;
}

export interface OnboardingResponse {
  id: string;
  name: string;
  businessType: string;
  industry: string;
  website?: string;
  description?: string;
  country?: string;
  timezone: string;
  currency: string;
  status: string;
  createdAt: Date;
}

export interface BusinessSetupResponse {
  business: OnboardingResponse;
  owner: {
    id: string;
    email: string;
    name: string;
  };
  defaultStages: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export const mapBusinessToResponse = (business: Business): OnboardingResponse => ({
  id: business.id,
  name: business.name,
  businessType: business.businessType || '',
  industry: business.businessType || '',
  website: business.email || undefined,
  description: undefined,
  country: business.country || undefined,
  timezone: business.timezone,
  currency: business.currency,
  status: business.status,
  createdAt: business.createdAt,
});
