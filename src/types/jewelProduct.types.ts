/**
 * Jewel product types
 */

import type { BaseEntity } from './common.types';
import type { SelectOption } from './common.types';

/** Product image with url, name, and size (from backend) */
export interface ProductImage {
  url: string;
  name: string;
  size: number;
}

// Jewel product entity
export interface JewelProduct extends BaseEntity {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  collection: string;
  certifications: string[];
  publishedOn: string;
  createdBy: string;
  updatedBy: string;
}

export interface StockItem extends BaseEntity {
  id: number;
  stockId: string;
  purity: string;
  added: string;
  lastModified: string;
}
// Inventory list item (API may return status, archivedAt, specifications, ProductImage[])
export interface InventoryJewelProduct extends Omit<JewelProduct, 'images'> {
  images: ProductImage[];
  status?: string;
  archivedAt?: string | null;
  weight?: number;
  metal?: string;
  specifications?: { name?: string; value?: string }[];
  specs?: { name?: string; value?: string }[];
}

// Form spec row (with id for drag-and-drop)
export interface JewelSpecItem {
  id: string;
  name: string;
  value: string;
}

// Single form state for create/edit jewel
export interface JewelFormState {
  jewelName: string;
  jewelDescription: string;
  metal: string;
  category: string;
  price: string;
  collection: string;
  publishedOn: Date | null;
  jewelSpecs: JewelSpecItem[];
  formStatus: boolean;
  archivedAt: Date | null;
  images?: ProductImage[];
}

// Modal state
export type JewelModalView = 'form' | 'preview' | 'archiveConfirm';
export type JewelModalType = 'new' | 'edit';

// Dropdown option arrays (shared)
export const METAL_OPTIONS: SelectOption[] = [
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
  { label: 'Platinum', value: 'platinum' },
];

export const CATEGORY_OPTIONS: SelectOption[] = [
  { label: 'Ring', value: 'ring' },
  { label: 'Necklace', value: 'necklace' },
  { label: 'Pendant', value: 'pendant' },
  { label: 'Earrings', value: 'earrings' },
  { label: 'Bracelet', value: 'bracelet' },
  { label: 'Bangles', value: 'bangles' },
  { label: 'Chain', value: 'chain' },
  { label: 'Nose Pin', value: 'nose pin' },
];

export const COLLECTION_OPTIONS: SelectOption[] = [
  { label: 'Trending', value: 'trending' },
  { label: 'New', value: 'new' },
  { label: 'New Arrivals', value: 'new arrivals' },
  { label: 'Best Seller', value: 'best seller' },
  { label: 'Featured', value: 'featured' },
  { label: 'Limited Edition', value: 'limited edition' },
  { label: 'Exclusive', value: 'exclusive' },
  { label: 'Exotic', value: 'exotic' },
  { label: 'Seasonal', value: 'seasonal' },
  { label: 'Holiday', value: 'holiday' },
  { label: 'Valentine', value: 'valentine' },
  { label: 'Christmas', value: 'christmas' },
  { label: 'New Year', value: 'new year' },
];

// Update jewel product request
export interface UpdateJewelProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[];
  category?: string;
  collection?: string;
  certifications?: string[];
  publishedOn?: string;
}