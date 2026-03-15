import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import type { InventoryJewelProduct } from '@/types/jewelProduct.types';
import { toDateOnly, formatDateOnlyDisplay } from '@/utils/dateUtils';
import { formatWeightDisplay } from '@/utils/format';
import { BUTTON_STYLES } from '@/config/inventoryStyles';
import { env } from '@/config/env';

export interface NameWeightPriceCellProps {
  rowData: InventoryJewelProduct;
}

/** Resolve weight from user-defined specs (any index) or fallback to row weight */
function getWeightFromRow(rowData: InventoryJewelProduct): number | undefined {
  const allSpecs = rowData.specs ?? rowData.specifications ?? [];
  const weightSpec = allSpecs.find((s) => s.name?.toLowerCase().trim() === 'weight');
  const weightFromSpecs = weightSpec != null ? Number(weightSpec.value) : undefined;
  return Number.isFinite(weightFromSpecs) ? weightFromSpecs : rowData.weight;
}

/** Build full image URL for relative paths (e.g. /uploads/product_images/...) */
function getProductImageUrl(rowData: InventoryJewelProduct): string {
  const firstImage = rowData.images?.[0];
  if (!firstImage) return 'https://primefaces.org/cdn/primereact/images/placeholder.png';
  const url = typeof firstImage === 'string' ? firstImage : firstImage.url;
  if (url.startsWith('http')) return url;
  const apiRoot = env.apiBaseUrl.replace(/\/api\/?$/, '');
  return url.startsWith('/') ? `${apiRoot}${url}` : `${apiRoot}/${url}`;
}

export function NameWeightPriceCell({ rowData }: NameWeightPriceCellProps) {
  const weight = getWeightFromRow(rowData);
  const imageUrl = getProductImageUrl(rowData);

  return (
    <div className="flex align-items-center px-2 gap-4">
      <img
        src={imageUrl}
        alt={rowData.name}
        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
      />
      <div className="grid">
        <span className="font-bold text-sm">{rowData.name}</span>
        <span className="text-xs text-500">
          {weight != null ? `${formatWeightDisplay(weight)}g` : '–'} &nbsp; ₹{rowData.price}
        </span>
      </div>
    </div>
  );
}

export interface ActionCellProps {
  rowData: InventoryJewelProduct;
  onStatusToggle: (productId: string | number, newStatus: boolean) => void;
  onBookClick?: (product: InventoryJewelProduct) => void;
}

export function ActionCell({ rowData, onStatusToggle, onBookClick }: ActionCellProps) {
  // console.log('rowData in ActionCell:', rowData);
  const pubOn = toDateOnly(rowData.publishedOn);
  // console.log('pubOn:', pubOn);
  const today = toDateOnly(new Date());
  const isPublishedDateReached = pubOn !== null && today !== null && today >= pubOn;
  const rawDate = rowData.status ? rowData.updatedAt : (rowData.archivedAt ?? rowData.publishedOn ?? rowData.updatedAt);
  // console.log('rawDate:', rawDate);
  const displayDate = formatDateOnlyDisplay(rawDate);
  // console.log('displayDate:', displayDate);

  return (
    <div
      className="flex flex-column items-center gap-1"
      onClick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <div className="flex items-center justify-center gap-2">
        <Button
          text
          style={{
            ...BUTTON_STYLES.iconButton,
            color: '#704F01',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onBookClick?.(rowData);
          }}
        >
          <span
            className="material-symbols-rounded cursor-pointer text-700"
            style={{ fontSize: '28px', fontWeight: '400' }}
          >
            auto_stories
          </span>
        </Button>
      </div>
      <div className="grid">
        <div onClick={(e) => e.stopPropagation()}>
          <InputSwitch
            pt={{
              slider: {
                style: {
                  backgroundColor: rowData.status === 'published' ? 'green' : '#555555',
                },
              },
            }}
            disabled={!isPublishedDateReached}
            checked={rowData.status === 'published'}
            onChange={(e) => onStatusToggle(rowData.id ?? '', !!e.value)}
          />
        </div>
        <span className="text-[8px] text-500 text-secondary-900 dark:text-white">
          {rowData.status === 'published' ? 'Published' : 'Archived'} {displayDate}
        </span>
      </div>
    </div>
  );
}
