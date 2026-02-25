import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import type { InventoryJewelProduct } from '@/types/jewelProduct.types';
import { toDateOnly } from '@/utils/dateUtils';
import { BUTTON_STYLES } from '@/config/inventoryStyles';

export interface NameWeightPriceCellProps {
  rowData: InventoryJewelProduct;
}

export function NameWeightPriceCell({ rowData }: NameWeightPriceCellProps) {
  return (
    <div className="flex align-items-center px-2 gap-4">
      <img
        src="https://primefaces.org"
        alt={rowData.name}
        className="w-3rem shadow-2 border-round"
        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
      />
      <div className="grid">
        <span className="font-bold text-sm">{rowData.name}</span>
        <span className="text-xs text-500">
          {rowData.weight} &nbsp; ₹{rowData.price}
        </span>
      </div>
    </div>
  );
}

export interface ActionCellProps {
  rowData: InventoryJewelProduct;
  onStatusToggle: (productId: number, newStatus: boolean) => void;
}

export function ActionCell({ rowData, onStatusToggle }: ActionCellProps) {
  const pubOn = toDateOnly(rowData.publishedOn ?? rowData.updatedAt ?? rowData.createdAt);
  const today = toDateOnly(new Date());
  const isPublishedDateReached = pubOn !== null && today !== null && today >= pubOn;
  const displayDate = rowData.status ? rowData.updatedAt : (rowData.archivedAt ?? rowData.updatedAt);

  return (
    <div className="flex flex-column items-center gap-1">
      <div className="flex items-center justify-center gap-2">
        <Button
          text
          style={{
            ...BUTTON_STYLES.iconButton,
            color: '#704F01',
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
                  backgroundColor: rowData.status ? 'green' : '#555555',
                },
              },
            }}
            disabled={!isPublishedDateReached}
            checked={!!rowData.status}
            onChange={(e) => onStatusToggle(Number(rowData.id), !!e.value)}
          />
        </div>
        <span className="text-[8px] text-500 text-secondary-900 dark:text-white">
          {rowData.status ? 'Published' : 'Archived'} {displayDate ?? ''}
        </span>
      </div>
    </div>
  );
}
