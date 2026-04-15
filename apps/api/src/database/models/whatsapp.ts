import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { whatsappAccounts, contacts, conversations, messages } from '../schema';

export type WhatsAppAccount = InferSelectModel<typeof whatsappAccounts>;
export type NewWhatsAppAccount = InferInsertModel<typeof whatsappAccounts>;
export type Contact = InferSelectModel<typeof contacts>;
export type NewContact = InferInsertModel<typeof contacts>;
export type Conversation = InferSelectModel<typeof conversations>;
export type NewConversation = InferInsertModel<typeof conversations>;
export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;

// WhatsApp Connection Request/Response Types
export interface WhatsAppConnectRequest {
  metaBusinessAccountId: string;
  metaPhoneNumberId: string;
  whatsappBusinessNumber: string;
  displayName?: string;
  accessToken: string;
  appId?: string;
  appSecret?: string;
}

export interface WhatsAppConnectResponse {
  id: string;
  whatsappBusinessNumber: string;
  displayName?: string;
  status: string;
  connectedAt?: Date;
  createdAt: Date;
}

export interface WhatsAppAccountResponse {
  id: string;
  businessId: string;
  whatsappBusinessNumber: string;
  displayName?: string;
  status: string;
  connectedAt?: Date;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactResponse {
  id: string;
  businessId: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone: string;
  email?: string;
  whatsappNumber?: string;
  status: string;
  isBlocked: boolean;
  lastMessageAt?: Date;
  createdAt: Date;
}

export interface ConversationResponse {
  id: string;
  businessId: string;
  contactId: string;
  status: string;
  priority: string;
  unreadCount: number;
  lastMessageAt?: Date;
  isArchived: boolean;
  isMuted: boolean;
  createdAt: Date;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  contactId: string;
  direction: string;
  messageType: string;
  contentText?: string;
  mediaUrl?: string;
  deliveryStatus: string;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  createdAt: Date;
}

export const mapWhatsAppAccountToResponse = (
  account: WhatsAppAccount
): WhatsAppAccountResponse => ({
  id: account.id,
  businessId: account.businessId,
  whatsappBusinessNumber: account.whatsappBusinessNumber,
  displayName: account.displayName || undefined,
  status: account.status,
  connectedAt: account.connectedAt || undefined,
  lastSyncAt: account.lastSyncAt || undefined,
  createdAt: account.createdAt,
  updatedAt: account.updatedAt,
});

export const mapContactToResponse = (contact: Contact): ContactResponse => ({
  id: contact.id,
  businessId: contact.businessId,
  firstName: contact.firstName || undefined,
  lastName: contact.lastName || undefined,
  fullName: contact.fullName || undefined,
  phone: contact.phone,
  email: contact.email || undefined,
  whatsappNumber: contact.whatsappNumber || undefined,
  status: contact.status,
  isBlocked: contact.isBlocked,
  lastMessageAt: contact.lastMessageAt || undefined,
  createdAt: contact.createdAt,
});

export const mapConversationToResponse = (conversation: Conversation): ConversationResponse => ({
  id: conversation.id,
  businessId: conversation.businessId,
  contactId: conversation.contactId,
  status: conversation.status,
  priority: conversation.priority,
  unreadCount: conversation.unreadCount,
  lastMessageAt: conversation.lastMessageAt || undefined,
  isArchived: conversation.isArchived,
  isMuted: conversation.isMuted,
  createdAt: conversation.createdAt,
});

export const mapMessageToResponse = (message: Message): MessageResponse => ({
  id: message.id,
  conversationId: message.conversationId,
  contactId: message.contactId,
  direction: message.direction,
  messageType: message.messageType,
  contentText: message.contentText || undefined,
  mediaUrl: message.mediaUrl || undefined,
  deliveryStatus: message.deliveryStatus,
  sentAt: message.sentAt || undefined,
  deliveredAt: message.deliveredAt || undefined,
  readAt: message.readAt || undefined,
  createdAt: message.createdAt,
});
