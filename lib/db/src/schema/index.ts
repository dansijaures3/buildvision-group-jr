import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  button1Text: text("button1_text"),
  button1Link: text("button1_link"),
  button2Text: text("button2_text"),
  button2Link: text("button2_link"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  icon: text("icon").notNull(),
  image: text("image").notNull(),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  displayOrder: integer("display_order").notNull().default(0),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  client: text("client").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull(),
  completedAt: text("completed_at").notNull(),
  featured: boolean("featured").notNull().default(false),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  location: text("location").notNull(),
  eventDate: text("event_date").notNull(),
  attendees: integer("attendees").notNull().default(0),
  category: text("category"),
});

export const commerceItems = pgTable("commerce_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  price: text("price").notNull(),
  priceAmount: integer("price_amount").notNull().default(0),
  currency: text("currency").notNull().default("XOF"),
  category: text("category").notNull(),
  available: boolean("available").notNull().default(true),
  stock: integer("stock").notNull().default(0),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address"),
  items: jsonb("items").$type<Array<{ id: number; name: string; price: number; quantity: number }>>().notNull().default([]),
  subtotal: integer("subtotal").notNull().default(0),
  total: integer("total").notNull().default(0),
  currency: text("currency").notNull().default("XOF"),
  status: text("status").notNull().default("pending"),
  paymentProvider: text("payment_provider").notNull().default("fedapay"),
  paymentTransactionId: text("payment_transaction_id"),
  paymentUrl: text("payment_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
  photo: text("photo").notNull(),
  bio: text("bio").notNull(),
  linkedin: text("linkedin"),
  email: text("email"),
  displayOrder: integer("display_order").notNull().default(0),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  author: text("author").notNull(),
  publishedAt: text("published_at").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
});

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  website: text("website"),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  photo: text("photo"),
});

export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company").notNull(),
  projectType: text("project_type").notNull(),
  budget: text("budget").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("nouveau"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const companyInfo = pgTable("company_info", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("BuildVision Group & JR Service"),
  tagline: text("tagline").notNull().default(""),
  about: text("about").notNull().default(""),
  mission: text("mission").notNull().default(""),
  vision: text("vision").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  whatsapp: text("whatsapp").notNull().default(""),
  address: text("address").notNull().default(""),
  city: text("city").notNull().default(""),
  country: text("country").notNull().default(""),
  hours: text("hours").notNull().default(""),
  facebook: text("facebook"),
  instagram: text("instagram"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  youtube: text("youtube"),
  logo: text("logo"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
