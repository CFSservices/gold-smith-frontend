/**
 * Jewel product form validation
 */

import type { JewelSpecItem } from '@/types/jewelProduct.types';

export const JEWEL_NAME_MAX_LENGTH = 200;
export const MIN_PHOTOS = 1;
export const MAX_PHOTOS = 10;
export const MAX_CERT_FILES = 10;

export interface JewelValidationResult {
  valid: boolean;
  error?: string;
}

function hasAtLeastOneValidSpec(specs: JewelSpecItem[]): boolean {
  return specs.some((s) => s.name.trim() !== '' && s.value.trim() !== '');
}

export function validateJewelForm(
  state: {
    jewelName: string;
    metal: string;
    category: string;
    price: string;
    jewelDescription: string;
    jewelSpecs: JewelSpecItem[];
    collection: string;
    publishedOn: Date | null;
  },
  options: { mode: 'new' | 'edit'; photoCount: number }
): JewelValidationResult {
  const nameTrimmed = state.jewelName.trim();
  if (!nameTrimmed) {
    return { valid: false, error: 'Jewel name is required.' };
  }
  if (nameTrimmed.length > JEWEL_NAME_MAX_LENGTH) {
    return { valid: false, error: `Jewel name must not exceed ${JEWEL_NAME_MAX_LENGTH} characters.` };
  }

  if (!state.metal) {
    return { valid: false, error: 'Please select a metal.' };
  }

  if (!state.category) {
    return { valid: false, error: 'Please select a category.' };
  }

  const priceTrimmed = state.price.trim();
  if (!priceTrimmed) {
    return { valid: false, error: 'Unit price is required.' };
  }
  const priceNum = parseFloat(priceTrimmed.replace(/,/g, ''));
  if (isNaN(priceNum) || priceNum <= 0) {
    return { valid: false, error: 'Unit price must be a valid positive number.' };
  }

  const descTrimmed = state.jewelDescription.trim();
  if (!descTrimmed) {
    return { valid: false, error: 'Jewel description is required.' };
  }

  if (!hasAtLeastOneValidSpec(state.jewelSpecs)) {
    return { valid: false, error: 'At least one jewel detail (name and value) is required.' };
  }

  if (!state.collection) {
    return { valid: false, error: 'Please select a collection.' };
  }

  if (!state.publishedOn) {
    return { valid: false, error: 'Published on date is required.' };
  }

  if (options.mode === 'new' && options.photoCount < MIN_PHOTOS) {
    return { valid: false, error: `Minimum ${MIN_PHOTOS} photos are required.` };
  }

  return { valid: true };
}

/** Allow only digits and one optional decimal point for price input */
export function parsePriceInput(value: string): string {
  if (value === '' || /^\d*\.?\d*$/.test(value)) return value;
  return value;
}
