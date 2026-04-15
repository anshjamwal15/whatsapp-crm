import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  bigint,
  jsonb,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ========================= 1. Users =========================
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 150 }).notNull(),
    email: varchar('email', { length: 150 }).notNull().unique(),
    phone: varchar('phone', { length: 30 }),
    passwordHash: text('password_hash').notNull(),
    profileImageUrl: text('profile_image_url'),
    isEmailVerified: boolean('is_email_verified').notNull().default(false),
    lastLoginAt: timestamp('last_login_at'),
    status: varchar('status', { length: 30 }).notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('idx_users_email').on(table.email),
  })
);

// ========================= 2. Businesses =========================
export const businesses = pgTable(
  'businesses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 150 }).notNull(),
    slug: varchar('slug', { length: 150 }).notNull().unique(),
    businessType: varchar('business_type', { length: 100 }),
    ownerUserId: uuid('owner_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    phone: varchar('phone', { length: 30 }),
    email: varchar('email', { length: 150 }),
    timezone: varchar('timezone', { length: 100 }).notNull().default('Asia/Kolkata'),
    country: varchar('country', { length: 100 }),
    currency: varchar('currency', { length: 20 }).notNull().default('INR'),
    logoUrl: text('logo_url'),
    status: varchar('status', { length: 30 }).notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex('idx_businesses_slug').on(table.slug),
    ownerUserIdIdx: index('idx_businesses_owner_user_id').on(table.ownerUserId),
  })
);

// ========================= 3. Business Members =========================
export const businessMembers = pgTable(
  'business_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 30 }).notNull(),
    isDefaultWorkspace: boolean('is_default_workspace').notNull().default(false),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
    invitedBy: uuid('invited_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    status: varchar('status', { length: 30 }).notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_business_members_business_id').on(table.businessId),
    userIdIdx: index('idx_business_members_user_id').on(table.userId),
    businessUserUnique: uniqueIndex('uq_business_members_business_user').on(
      table.businessId,
      table.userId
    ),
  })
);

// ========================= 4. WhatsApp Accounts =========================
export const whatsappAccounts = pgTable(
  'whatsapp_accounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    metaBusinessAccountId: varchar('meta_business_account_id', { length: 100 }),
    metaPhoneNumberId: varchar('meta_phone_number_id', { length: 100 }),
    whatsappBusinessNumber: varchar('whatsapp_business_number', { length: 30 }).notNull(),
    displayName: varchar('display_name', { length: 150 }),
    accessToken: text('access_token'),
    webhookVerifyToken: text('webhook_verify_token'),
    appId: varchar('app_id', { length: 100 }),
    appSecret: text('app_secret'),
    status: varchar('status', { length: 30 }).notNull().default('pending'),
    connectedAt: timestamp('connected_at'),
    lastSyncAt: timestamp('last_sync_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_whatsapp_accounts_business_id').on(table.businessId),
    businessUnique: uniqueIndex('uq_whatsapp_accounts_business').on(table.businessId),
    numberUnique: uniqueIndex('uq_whatsapp_accounts_number').on(table.whatsappBusinessNumber),
  })
);

// ========================= 5. Contact Sources =========================
export const contactSources = pgTable(
  'contact_sources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    isDefault: boolean('is_default').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_contact_sources_business_id').on(table.businessId),
    businessNameUnique: uniqueIndex('uq_contact_sources_business_name').on(
      table.businessId,
      table.name
    ),
  })
);

// ========================= 6. Pipeline Stages =========================
export const pipelineStages = pgTable(
  'pipeline_stages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    color: varchar('color', { length: 20 }),
    sortOrder: integer('sort_order').notNull().default(0),
    isDefault: boolean('is_default').notNull().default(false),
    isClosedStage: boolean('is_closed_stage').notNull().default(false),
    stageType: varchar('stage_type', { length: 30 }).notNull().default('open'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_pipeline_stages_business_id').on(table.businessId),
    sortOrderIdx: index('idx_pipeline_stages_sort_order').on(table.businessId, table.sortOrder),
    businessSlugUnique: uniqueIndex('uq_pipeline_stages_business_slug').on(
      table.businessId,
      table.slug
    ),
  })
);

// ========================= 7. Contacts =========================
export const contacts = pgTable(
  'contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    sourceId: uuid('source_id').references(() => contactSources.id, {
      onDelete: 'set null',
    }),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    fullName: varchar('full_name', { length: 150 }),
    phone: varchar('phone', { length: 30 }).notNull(),
    email: varchar('email', { length: 150 }),
    whatsappNumber: varchar('whatsapp_number', { length: 30 }),
    profileImageUrl: text('profile_image_url'),
    city: varchar('city', { length: 100 }),
    state: varchar('state', { length: 100 }),
    country: varchar('country', { length: 100 }),
    assignedToUserId: uuid('assigned_to_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    currentStageId: uuid('current_stage_id').references(() => pipelineStages.id, {
      onDelete: 'set null',
    }),
    status: varchar('status', { length: 30 }).notNull().default('active'),
    isBlocked: boolean('is_blocked').notNull().default(false),
    isSpam: boolean('is_spam').notNull().default(false),
    lastMessageAt: timestamp('last_message_at'),
    lastIncomingMessageAt: timestamp('last_incoming_message_at'),
    lastOutgoingMessageAt: timestamp('last_outgoing_message_at'),
    lastFollowupAt: timestamp('last_followup_at'),
    nextFollowupAt: timestamp('next_followup_at'),
    wonAt: timestamp('won_at'),
    lostAt: timestamp('lost_at'),
    lostReason: varchar('lost_reason', { length: 255 }),
    customFields: jsonb('custom_fields').notNull().default({}),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_contacts_business_id').on(table.businessId),
    sourceIdIdx: index('idx_contacts_source_id').on(table.sourceId),
    assignedToUserIdIdx: index('idx_contacts_assigned_to_user_id').on(table.assignedToUserId),
    currentStageIdIdx: index('idx_contacts_current_stage_id').on(table.currentStageId),
    lastMessageAtIdx: index('idx_contacts_last_message_at').on(table.lastMessageAt),
    nextFollowupAtIdx: index('idx_contacts_next_followup_at').on(table.nextFollowupAt),
    businessPhoneUnique: uniqueIndex('uq_contacts_business_phone').on(
      table.businessId,
      table.phone
    ),
  })
);

// ========================= 8. Contact Stage History =========================
export const contactStageHistory = pgTable(
  'contact_stage_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    contactId: uuid('contact_id')
      .notNull()
      .references(() => contacts.id, { onDelete: 'cascade' }),
    fromStageId: uuid('from_stage_id').references(() => pipelineStages.id, {
      onDelete: 'set null',
    }),
    toStageId: uuid('to_stage_id').references(() => pipelineStages.id, {
      onDelete: 'set null',
    }),
    changedByUserId: uuid('changed_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    reason: text('reason'),
    changedAt: timestamp('changed_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_contact_stage_history_business_id').on(table.businessId),
    contactIdIdx: index('idx_contact_stage_history_contact_id').on(table.contactId),
    changedAtIdx: index('idx_contact_stage_history_changed_at').on(table.changedAt),
  })
);

// ========================= 9. Conversations =========================
export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    whatsappAccountId: uuid('whatsapp_account_id')
      .notNull()
      .references(() => whatsappAccounts.id, { onDelete: 'cascade' }),
    contactId: uuid('contact_id')
      .notNull()
      .references(() => contacts.id, { onDelete: 'cascade' }),
    assignedToUserId: uuid('assigned_to_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    subject: varchar('subject', { length: 255 }),
    status: varchar('status', { length: 30 }).notNull().default('open'),
    priority: varchar('priority', { length: 20 }).notNull().default('normal'),
    unreadCount: integer('unread_count').notNull().default(0),
    lastMessageId: uuid('last_message_id'),
    lastMessageAt: timestamp('last_message_at'),
    lastIncomingMessageAt: timestamp('last_incoming_message_at'),
    lastOutgoingMessageAt: timestamp('last_outgoing_message_at'),
    isArchived: boolean('is_archived').notNull().default(false),
    isMuted: boolean('is_muted').notNull().default(false),
    snoozedUntil: timestamp('snoozed_until'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_conversations_business_id').on(table.businessId),
    contactIdIdx: index('idx_conversations_contact_id').on(table.contactId),
    assignedToUserIdIdx: index('idx_conversations_assigned_to_user_id').on(table.assignedToUserId),
    lastMessageAtIdx: index('idx_conversations_last_message_at').on(table.lastMessageAt),
    unreadCountIdx: index('idx_conversations_unread_count').on(table.unreadCount),
    statusIdx: index('idx_conversations_status').on(table.status),
    businessAccountContactUnique: uniqueIndex(
      'uq_conversations_business_account_contact'
    ).on(table.businessId, table.whatsappAccountId, table.contactId),
  })
);

// ========================= 10. Messages =========================
export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    contactId: uuid('contact_id')
      .notNull()
      .references(() => contacts.id, { onDelete: 'cascade' }),
    senderUserId: uuid('sender_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    whatsappMessageId: varchar('whatsapp_message_id', { length: 150 }),
    direction: varchar('direction', { length: 20 }).notNull(),
    messageType: varchar('message_type', { length: 30 }).notNull(),
    contentText: text('content_text'),
    mediaUrl: text('media_url'),
    mediaMimeType: varchar('media_mime_type', { length: 100 }),
    mediaFileName: varchar('media_file_name', { length: 255 }),
    mediaSizeBytes: bigint('media_size_bytes', { mode: 'number' }),
    caption: text('caption'),
    templateName: varchar('template_name', { length: 150 }),
    templateLanguage: varchar('template_language', { length: 20 }),
    templateVariables: jsonb('template_variables').notNull().default([]),
    deliveryStatus: varchar('delivery_status', { length: 30 }).notNull().default('pending'),
    errorCode: varchar('error_code', { length: 50 }),
    errorMessage: text('error_message'),
    sentAt: timestamp('sent_at'),
    deliveredAt: timestamp('delivered_at'),
    readAt: timestamp('read_at'),
    failedAt: timestamp('failed_at'),
    rawPayload: jsonb('raw_payload').notNull().default({}),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_messages_business_id').on(table.businessId),
    conversationIdIdx: index('idx_messages_conversation_id').on(table.conversationId),
    contactIdIdx: index('idx_messages_contact_id').on(table.contactId),
    senderUserIdIdx: index('idx_messages_sender_user_id').on(table.senderUserId),
    whatsappMessageIdIdx: index('idx_messages_whatsapp_message_id').on(table.whatsappMessageId),
    createdAtIdx: index('idx_messages_created_at').on(table.createdAt),
    deliveryStatusIdx: index('idx_messages_delivery_status').on(table.deliveryStatus),
    directionIdx: index('idx_messages_direction').on(table.direction),
  })
);

// Add foreign key for conversations.lastMessageId after messages table is defined
export const conversationsRelations = relations(conversations, ({ one }) => ({
  lastMessage: one(messages, {
    fields: [conversations.lastMessageId],
    references: [messages.id],
  }),
}));

// ========================= 11. Tags =========================
export const tags = pgTable(
  'tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    color: varchar('color', { length: 20 }),
    description: text('description'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_tags_business_id').on(table.businessId),
    businessNameUnique: uniqueIndex('uq_tags_business_name').on(table.businessId, table.name),
  })
);

// ========================= 12. Contact Tags =========================
export const contactTags = pgTable(
  'contact_tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    contactId: uuid('contact_id')
      .notNull()
      .references(() => contacts.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_contact_tags_business_id').on(table.businessId),
    contactIdIdx: index('idx_contact_tags_contact_id').on(table.contactId),
    tagIdIdx: index('idx_contact_tags_tag_id').on(table.tagId),
    contactTagUnique: uniqueIndex('uq_contact_tags_contact_tag').on(table.contactId, table.tagId),
  })
);

// ========================= 13. Notes =========================
export const notes = pgTable(
  'notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    contactId: uuid('contact_id').references(() => contacts.id, {
      onDelete: 'cascade',
    }),
    conversationId: uuid('conversation_id').references(() => conversations.id, {
      onDelete: 'cascade',
    }),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    noteText: text('note_text').notNull(),
    isPinned: boolean('is_pinned').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_notes_business_id').on(table.businessId),
    contactIdIdx: index('idx_notes_contact_id').on(table.contactId),
    conversationIdIdx: index('idx_notes_conversation_id').on(table.conversationId),
  })
);

// ========================= 14. Reminders =========================
export const reminders = pgTable(
  'reminders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    contactId: uuid('contact_id')
      .notNull()
      .references(() => contacts.id, { onDelete: 'cascade' }),
    conversationId: uuid('conversation_id').references(() => conversations.id, {
      onDelete: 'set null',
    }),
    assignedToUserId: uuid('assigned_to_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    title: varchar('title', { length: 150 }).notNull(),
    description: text('description'),
    reminderType: varchar('reminder_type', { length: 30 }).notNull().default('followup'),
    dueAt: timestamp('due_at').notNull(),
    completedAt: timestamp('completed_at'),
    snoozedUntil: timestamp('snoozed_until'),
    status: varchar('status', { length: 30 }).notNull().default('pending'),
    priority: varchar('priority', { length: 20 }).notNull().default('normal'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_reminders_business_id').on(table.businessId),
    contactIdIdx: index('idx_reminders_contact_id').on(table.contactId),
    conversationIdIdx: index('idx_reminders_conversation_id').on(table.conversationId),
    assignedToUserIdIdx: index('idx_reminders_assigned_to_user_id').on(table.assignedToUserId),
    dueAtIdx: index('idx_reminders_due_at').on(table.dueAt),
    statusIdx: index('idx_reminders_status').on(table.status),
  })
);

// ========================= 15. Quick Replies =========================
export const quickReplies = pgTable(
  'quick_replies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id')
      .notNull()
      .references(() => businesses.id, { onDelete: 'cascade' }),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    title: varchar('title', { length: 150 }).notNull(),
    category: varchar('category', { length: 100 }),
    shortcut: varchar('shortcut', { length: 50 }),
    content: text('content').notNull(),
    variables: jsonb('variables').notNull().default([]),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_quick_replies_business_id').on(table.businessId),
    categoryIdx: index('idx_quick_replies_category').on(table.category),
    businessShortcutUnique: uniqueIndex('uq_quick_replies_business_shortcut').on(
      table.businessId,
      table.shortcut
    ),
  })
);

// ========================= 16. Webhook Events =========================
export const webhookEvents = pgTable(
  'webhook_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, {
      onDelete: 'cascade',
    }),
    whatsappAccountId: uuid('whatsapp_account_id').references(() => whatsappAccounts.id, {
      onDelete: 'cascade',
    }),
    eventType: varchar('event_type', { length: 100 }).notNull(),
    externalEventId: varchar('external_event_id', { length: 150 }),
    payload: jsonb('payload').notNull(),
    processingStatus: varchar('processing_status', { length: 30 }).notNull().default('pending'),
    failureReason: text('failure_reason'),
    receivedAt: timestamp('received_at').notNull().defaultNow(),
    processedAt: timestamp('processed_at'),
  },
  (table) => ({
    businessIdIdx: index('idx_webhook_events_business_id').on(table.businessId),
    whatsappAccountIdIdx: index('idx_webhook_events_whatsapp_account_id').on(
      table.whatsappAccountId
    ),
    processingStatusIdx: index('idx_webhook_events_processing_status').on(table.processingStatus),
    receivedAtIdx: index('idx_webhook_events_received_at').on(table.receivedAt),
  })
);

// ========================= 17. Audit Logs =========================
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, {
      onDelete: 'cascade',
    }),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    entityType: varchar('entity_type', { length: 100 }).notNull(),
    entityId: uuid('entity_id'),
    action: varchar('action', { length: 100 }).notNull(),
    oldValues: jsonb('old_values').notNull().default({}),
    newValues: jsonb('new_values').notNull().default({}),
    ipAddress: varchar('ip_address', { length: 100 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    businessIdIdx: index('idx_audit_logs_business_id').on(table.businessId),
    userIdIdx: index('idx_audit_logs_user_id').on(table.userId),
    entityTypeEntityIdIdx: index('idx_audit_logs_entity_type_entity_id').on(
      table.entityType,
      table.entityId
    ),
    createdAtIdx: index('idx_audit_logs_created_at').on(table.createdAt),
  })
);
