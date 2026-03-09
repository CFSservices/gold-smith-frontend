/**
 * Jewel product utilities
 */

import type { ProductImage } from '@/types/jewelProduct.types';

/** Normalize product_images from backend (string[] or ProductImage[]) to ProductImage[] */
export function normalizeProductImages(raw: unknown): ProductImage[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item): ProductImage => {
    if (item && typeof item === 'object' && 'url' in item && typeof (item as ProductImage).url === 'string') {
      const obj = item as ProductImage;
      return { url: obj.url, name: obj.name ?? obj.url.split('/').pop() ?? 'image', size: obj.size ?? 0 };
    }
    const url = String(item ?? '');
    const name = url.split('/').pop() ?? 'image';
    console.log('normalizeProductImages: url:', url, 'name:', name);
    return { url, name, size: 0 };
  });
}
