/**
 * View Product Modal - Image carousel, purity selector, description, details
 * Figma node: 397:28125
 */

import { useState, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { SelectButton } from 'primereact/selectbutton';
import { formatCurrency } from '@/utils/format';
import type { OrderItem } from '@/features/orders/types';

interface ViewProductModalProps {
  item: OrderItem | null;
  visible: boolean;
  onHide: () => void;
}

const purityOptions = [
  { label: '22K', value: '22K' },
  { label: '18K', value: '18K' },
  { label: '10K', value: '10K' },
];

export function ViewProductModal({ item, visible, onHide }: ViewProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPurity, setSelectedPurity] = useState('22K');

  // Build image array — use main image + generate placeholder variants
  const images = item
    ? [item.image, item.image, item.image, item.image, item.image]
    : [];

  const handleDotClick = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  if (!item) {
    return null;
  }

  return (
    <Dialog
      header={
        <div className="text-xl-bold text-secondary-900 dark:text-white pr-8">
          {item.name}
        </div>
      }
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '720px' }}
      modal
      draggable={false}
      resizable={false}
      dismissableMask
      blockScroll
    >
      <div className="space-y-6">
        {/* Image carousel */}
        <div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`shrink-0 w-[280px] h-[280px] rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${
                  idx === currentImageIndex
                    ? 'border-gold-500'
                    : 'border-transparent'
                }`}
                onClick={() => { setCurrentImageIndex(idx); }}
              >
                <img
                  src={img}
                  alt={`${item.name} view ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-3">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { handleDotClick(idx); }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  idx === currentImageIndex
                    ? 'bg-secondary-900 dark:bg-white'
                    : 'bg-secondary-300 dark:bg-secondary-600'
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Purity selector */}
        <div>
          <div className="text-sm-semibold text-secondary-700 dark:text-secondary-300 mb-2">
            Purity
          </div>
          <SelectButton
            value={selectedPurity}
            onChange={(e) => { setSelectedPurity(e.value as string); }}
            options={purityOptions}
            className="w-full max-w-xs"
          />
        </div>

        {/* Description */}
        <div>
          <div className="text-sm-semibold text-gold-700 dark:text-gold-400 mb-2">
            Description
          </div>
          <p className="text-sm-normal text-secondary-600 dark:text-secondary-400 leading-relaxed">
            Embrace the charm of our {item.name}. This exquisite piece adds a warm touch
            to any occasion. Wear it as a reminder of life&apos;s beauty or gift it to someone
            special. Elevate your jewelry collection with this elegant design.
          </p>
        </div>

        {/* Details table */}
        <div>
          <div className="text-sm-semibold text-gold-700 dark:text-gold-400 mb-2">
            Details
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-sm-normal">
            <div className="text-secondary-500 dark:text-secondary-400">Brand</div>
            <div className="text-secondary-900 dark:text-white">Code Flakes Studio</div>

            <div className="text-secondary-500 dark:text-secondary-400">Material</div>
            <div className="text-secondary-900 dark:text-white">{item.material}</div>

            <div className="text-secondary-500 dark:text-secondary-400">Weight</div>
            <div className="text-secondary-900 dark:text-white">{item.weight}</div>

            <div className="text-secondary-500 dark:text-secondary-400">Unit Price</div>
            <div className="text-secondary-900 dark:text-white">
              {formatCurrency(item.unitPrice)}
            </div>

            <div className="text-secondary-500 dark:text-secondary-400">Purity</div>
            <div className="text-secondary-900 dark:text-white">{selectedPurity}</div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
