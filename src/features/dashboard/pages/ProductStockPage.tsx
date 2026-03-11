/**
 * Product Stock Page - Child page showing stock items for a specific jewel product
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { jewelProductService, type StockItemUpsertPayload } from '@/api/services/jewelProduct.service';
import type { InventoryJewelProduct } from '@/types/jewelProduct.types';
import { normalizeProductImages } from '@/utils/jewelProductUtils';
import { formatDateTime } from '@/utils/dateUtils';
import { BUTTON_STYLES, DATA_TABLE_DARK_PT } from '@/config/inventoryStyles';

export interface ProductStockItem {
  id: string;
  stockId: string;
  purity: string;
  added: string;
  lastModified: string;
  status: 'In Shop' | 'Sold' | 'Returned' | 'Under Repair' | 'Repaired' | 'Replaced';
}

const PURITY_OPTIONS = [
  { label: '10K', value: '10K' },
  { label: '18K', value: '18K' },
  { label: '22K', value: '22K' },
  { label: '24K', value: '24K' },
];

const STATUS_OPTIONS = [
  { label: 'In Shop', value: 'In Shop' },
  { label: 'Sold', value: 'Sold' },
  { label: 'Returned', value: 'Returned' },
  { label: 'Under Repair', value: 'Under Repair' },
  { label: 'Repaired', value: 'Repaired' },
  { label: 'Replaced', value: 'Replaced' },
];

/** Generate mock stock items for a product */
function generateMockStockItems(_productId: number): ProductStockItem[] {
  const baseDate = '2025-02-13';
  return [
    { id: '1', stockId: '202511051133001', purity: '10K', added: baseDate, lastModified: baseDate, status: 'In Shop' },
    { id: '2', stockId: '202511051133002', purity: '18K', added: baseDate, lastModified: baseDate, status: 'In Shop' },
    { id: '3', stockId: '202511051133003', purity: '22K', added: baseDate, lastModified: baseDate, status: 'Under Repair' },
    { id: '4', stockId: '202511051133004', purity: '24K', added: baseDate, lastModified: baseDate, status: 'Returned' },
    { id: '5', stockId: '202511051133005', purity: '18K', added: baseDate, lastModified: baseDate, status: 'Sold' },
  ];
}

/** Map backend stock item shape to local ProductStockItem */
function mapBackendStockToItem(stock: any): ProductStockItem {
  // console.log('stock:', stock);
  const details = stock?.stock_item_details ?? {};
  const rawStatus = details.stock_status as string | undefined;
  const normalizedStatus: ProductStockItem['status'] =
    rawStatus === 'sold'
      ? 'Sold'
      : rawStatus === 'returned'
        ? 'Returned'
        : rawStatus === 'under_repair'
          ? 'Under Repair'
          : rawStatus === 'repaired'
            ? 'Repaired'
            : rawStatus === 'replaced'
              ? 'Replaced'
              : 'In Shop';

  const stock_details = {
    id: String(stock.stock_id ?? ''),
    stockId: String(details.item_id ?? ''),
    purity: String(details.purity ?? ''),
    added: String(stock.created_at ?? ''),
    lastModified: String(stock.updated_at ?? ''),
    status: normalizedStatus,
  };
  // console.log('stock details:', stock_details);
  return stock_details;
}

function mapUiStatusToBackend(status: ProductStockItem['status']): string {
  switch (status) {
    case 'Sold':
      return 'sold';
    case 'Returned':
      return 'returned';
    case 'Under Repair':
      return 'under_repair';
    case 'Repaired':
      return 'repaired';
    case 'Replaced':
      return 'replaced';
    case 'In Shop':
    default:
      return 'in_shop';
  }
}

function mapBackendToInventory(p: Record<string, unknown>): InventoryJewelProduct {
  // console.log('p:', p);
  const id = (p.product_id ?? p.id ?? p.ID ?? 0) as number;
  const metaDetails = (p.product_catalog_details ?? {}) as Record<string, unknown>;
  const name = (metaDetails.product_name ?? metaDetails.name ?? p.product_name ?? p.name ?? '') as string;
  const rawImages = metaDetails.product_images ?? p.images;
  return {
    id,
    name,
    description: (metaDetails.product_description ?? metaDetails.description ?? p.product_description ?? p.description ?? '') as string,
    price: (metaDetails.unit_price ?? metaDetails.product_price ?? p.unit_price ?? p.price ?? 0) as number,
    stock: (metaDetails.stock ?? p.stock ?? 0) as number,
    images: normalizeProductImages(rawImages),
    category: (p.category ?? '') as string,
    collection: (p.collection ?? '') as string,
    certifications: [] as string[],
    publishedOn: '',
    createdAt: (p.createdAt ?? p.created_at ?? '') as string,
    updatedAt: (p.updatedAt ?? p.updated_at ?? '') as string,
    createdBy: '',
    updatedBy: '',
  };
}

export function ProductStockPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const toastRef = useRef<Toast>(null);
  const [product, setProduct] = useState<InventoryJewelProduct | null>(null);
  const [stockTab, setStockTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockItems, setStockItems] = useState<ProductStockItem[]>([]);
  const [addStockModalOpen, setAddStockModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({ stockId: '', purity: '18K', status: 'In Shop' as ProductStockItem['status'] });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductStockItem | null>(null);
  const [editForm, setEditForm] = useState<{ purity: string; status: ProductStockItem['status'] }>({ purity: '18K', status: 'In Shop' });

  // Fetch product details
  useEffect(() => {
    if (!productId) {
      return;
    }
    jewelProductService
      .getJewelProductById(productId)
      .then((res) => {
        const data = (res as { data?: unknown })?.data;
        // console.log('data:', data);
        if (data && typeof data === 'object') {
          // console.log('mapBackendToInventory:', mapBackendToInventory(data as Record<string, unknown>));
          setProduct(mapBackendToInventory(data as Record<string, unknown>));
        } else {
          setProduct({
            id: Number(productId),
            name: typeof data === 'object' && data !== null && 'product_name' in data ? String((data as Record<string, unknown>).product_name) : '',
            description: '',
            price: 0,
            stock: 0,
            images: [],
            category: '',
            collection: '',
            certifications: [],
            publishedOn: '',
            createdAt: '',
            updatedAt: '',
            createdBy: '',
            updatedBy: '',
          });
        }
      })
      .catch(() => {
        setProduct({
          id: Number(productId),
          name: `Product ${productId}`,
          description: '',
          price: 0,
          stock: 0,
          images: [],
          category: '',
          collection: '',
          certifications: [],
          publishedOn: '',
          createdAt: '',
          updatedAt: '',
          createdBy: '',
          updatedBy: '',
        });
      })
    // console.log('product:', product);
  }, [productId]);

  // Fetch stock items for this product, with mock fallback
  useEffect(() => {
    if (!productId) return;

    jewelProductService
      .getStockItemsList(productId)
      .then((res) => {
        const payload = (res as { data?: any })?.data;
        const itemsArray = payload?.items as any[] | undefined;

        if (Array.isArray(itemsArray) && itemsArray.length > 0) {
          const mapped = itemsArray.map((s) => mapBackendStockToItem(s));
          setStockItems(mapped);
        } else if (product) {
          setStockItems(generateMockStockItems(product.id));
        }
      })
      .catch(() => {
        if (product) {
          setStockItems(generateMockStockItems(product.id));
        } else if (productId) {
          setStockItems(generateMockStockItems(Number(productId)));
        }
      });
  }, [product, productId]);

  const addStockItem = useCallback((item: ProductStockItem) => {
    setStockItems((prev) => [...prev, item]);
    toastRef.current?.show({ severity: 'success', summary: 'Added', detail: 'Stock item added.' });
    setAddStockModalOpen(false);
    setManualForm({ stockId: '', purity: '18K', status: 'In Shop' });
  }, []);

  // Update purity/status for a given stock item via API
  const handleUpdateStockField = useCallback(
    (item: ProductStockItem, updates: Partial<ProductStockItem>) => {
      // console.log('item:', item);
      // console.log('updates:', updates);
      const next: ProductStockItem = {
        ...item,
        ...updates,
        lastModified: new Date().toISOString().slice(0, 10),
      };
      // console.log('next:', next);

      const payload: any = {
        status: mapUiStatusToBackend(next.status),
      };
      // console.log('payload:', payload);

      jewelProductService.changeStockStatus(next.id.toString(), payload)
        .then(() => {
          setStockItems((prev) =>
            prev.map((s) => (s.id === next.id ? next : s)),
          );
        })
        .catch(() => {
          toastRef.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update stock item.',
          });
        });
    },
    [],
  );

  const handleManualAdd = useCallback(() => {
    if (!productId) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Missing product ID for creating stock item.',
      });
      return;
    }

    if (!manualForm.stockId.trim()) {
      toastRef.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Stock ID is required.',
      });
      return;
    }
    const exists = stockItems.some((s) => s.stockId === manualForm.stockId.trim());
    if (exists) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Duplicate',
        detail: 'Stock ID already exists.',
      });
      return;
    }

    const payload: StockItemUpsertPayload = {
      stockId: manualForm.stockId.trim(),
      purity: manualForm.purity,
      status: mapUiStatusToBackend(manualForm.status),
    };

    jewelProductService
      .createStockItem(productId, payload)
      .then((res) => {
        const created = (res as { data?: any }).data;
        // console.log('created:', created);
        const newItem: ProductStockItem =
          created != null
            ? mapBackendStockToItem(created)
            : {
                id: crypto.randomUUID(),
                stockId: manualForm.stockId.trim(),
                purity: manualForm.purity,
                added: new Date().toISOString().slice(0, 10),
                lastModified: new Date().toISOString().slice(0, 10),
                status: manualForm.status,
              };
        // console.log('newItem:', newItem);
        addStockItem(newItem);
      })
      .catch(() => {
        // Fallback to local mock item if API fails
        const fallbackItem: ProductStockItem = {
          id: crypto.randomUUID(),
          stockId: manualForm.stockId.trim(),
          purity: manualForm.purity,
          added: new Date().toISOString().slice(0, 10),
          lastModified: new Date().toISOString().slice(0, 10),
          status: manualForm.status,
        };
        addStockItem(fallbackItem);
        toastRef.current?.show({
          severity: 'error',
          summary: 'API Error',
          detail: 'Failed to create stock item via API. Using local mock entry.',
        });
      });
  }, [addStockItem, manualForm, productId, stockItems]);

  const filteredStockItems = stockItems.filter((item) => {
    if (stockTab !== 'all') {
      const statusMap: Record<string, ProductStockItem['status'][]> = {
        in_shop: ['In Shop'],
        sold: ['Sold'],
        returned_under_repair: ['Returned', 'Under Repair'],
        repaired_replaced: ['Repaired', 'Replaced'],
      };
      const allowed = statusMap[stockTab] ?? [];
      if (allowed.length > 0 && !allowed.includes(item.status)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.stockId.toLowerCase().includes(q) || item.purity.toLowerCase().includes(q);
    }
    return true;
  });

  const stockTabOptionsWithCounts = useMemo(() => {
    const countAll = stockItems.length;
    const countInShop = stockItems.filter((s) => s.status === 'In Shop').length;
    const countSold = stockItems.filter((s) => s.status === 'Sold').length;
    const countReturned = stockItems.filter((s) => s.status === 'Returned').length;
    const countUnderRepair = stockItems.filter((s) => s.status === 'Under Repair').length;
    const countRepaired = stockItems.filter((s) => s.status === 'Repaired').length;
    const countReplaced = stockItems.filter((s) => s.status === 'Replaced').length;
    return [
      { label: `All (${countAll})`, value: 'all' },
      { label: `In Shop (${countInShop})`, value: 'in_shop' },
      { label: `Sold (${countSold})`, value: 'sold' },
      { label: `Returned & Under Repair (${countReturned + countUnderRepair})`, value: 'returned_under_repair' },
      { label: `Repaired & Replaced (${countRepaired + countReplaced})`, value: 'repaired_replaced' },
    ];
  }, [stockItems]);

  const getRowClassName = useCallback((data: ProductStockItem) => ({
    'border-l-4 border-l-green-500': data.status === 'In Shop',
    'border-l-4 border-l-red-500': data.status === 'Returned' || data.status === 'Under Repair',
  }), []);

  const handleEditSave = useCallback(async () => {
    if (!editingItem) return;
  
    // console.log('editingItem:', editingItem);
    const payload: StockItemUpsertPayload = {
      stockId: editingItem.id.toString(),
      purity: editForm.purity,
      status: mapUiStatusToBackend(editForm.status),
    };

    // console.log('payload:', payload);
    try {
      await jewelProductService.updateStockItem(productId as string, editingItem.id, payload);
      const updated: ProductStockItem = {
        ...editingItem,
        purity: editForm.purity,
        status: editForm.status,
        lastModified: new Date().toISOString().slice(0, 10),
      };
      setStockItems((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s)),
      );
      setEditModalOpen(false);
      setEditingItem(null);
      toastRef.current?.show({
        severity: 'success',
        summary: 'Updated',
        detail: 'Stock item updated successfully.',
      });
    } catch {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update stock item.',
      });
    }
  }, [editForm, editingItem, setStockItems]);

  const handleDeleteStock = useCallback(async () => {
    if (!editingItem) return;
  
    try {
      await jewelProductService.deleteStockItem(productId as string, editingItem.id.toString());
      setStockItems((prev) => prev.filter((s) => s.id !== editingItem.id));
      setEditModalOpen(false);
      setEditingItem(null);
      toastRef.current?.show({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Stock item deleted successfully.',
      });
    } catch {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete stock item.',
      });
    }
  }, [editingItem, setStockItems]);

  return (
    <div className="body dark:body h-full">
      <Toast ref={toastRef} />
      <section className="flex items-center justify-between py-2 px-3">
        <div className="flex items-center gap-2">
          <Button
            text
            style={{ ...BUTTON_STYLES.iconButton, height: '32px', width: '32px' }}
            onClick={() => navigate('/jewels/inventory')}
          >
            <span className="material-symbols-rounded flex items-center justify-center text-[#704F01] dark:text-white font-light text-2xl">
              chevron_left
            </span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white m-0">
              {product?.name ?? 'Product'}
            </h1>
            <p className="m-0 text-sm text-500 text-secondary-900 dark:text-white">
              Jewel Inventory / { product?.name ?? 'Product'}
            </p>
          </div>
        </div>
        <Button style={BUTTON_STYLES.primaryButton} onClick={() => setAddStockModalOpen(true)}>
          <span className="material-symbols-rounded text-white" style={{ fontSize: '16px', fontWeight: '400' }}>
            qr_code_scanner
          </span>
          <p className="m-0 text-base">Scan / Add New Stock</p>
        </Button>
      </section>

      <hr className="mb-0" />

      <section className=" grid grid-cols-1 xl:flex items-center justify-between px-4 py-3 h-19.5">
        <SelectButton
          value={stockTab}
          options={stockTabOptionsWithCounts}
          onChange={(e) => setStockTab(e.value)}
          optionLabel="label"
          optionValue="value"
          pt={{
            root: {
              className:
                'p-2 bg-gray-100 rounded-full flex gap-1 border-none rounded-xl dark:bg-[#704f01]',
            },
            button: ({ context }: { context: { selected?: boolean } }) => ({
              className: `px-3 py-2 rounded-lg border-none transition-all duration-200 gap-1 focus:outline-none focus:ring-0 focus:shadow-none ${
                context.selected
                  ? 'bg-[#404040] text-white font-bold shadow-sm dark:text-[#2e240f] dark:bg-white'
                  : 'bg-transparent text-gray-500 hover:bg-gray-200 dark:text-white dark:hover:bg-[#5a3e0c] dark:hover:text-white'
              }`,
            }),
            label: { className: 'p-0' },
          }}
        />
        <div className="flex items-center gap-4">
          <Button text style={{ ...BUTTON_STYLES.iconButton, fontSize: '32px' }}>
            <span className="material-symbols-rounded text-[#704F01] dark:text-white" style={{ fontSize: '28px' }}>
              filter_alt
            </span>
          </Button>
          <IconField iconPosition="left" pt={{ root: { className: 'border-lg' } }}>
            <InputIcon pt={{ root: { className: 'flex items-center top-2/5' } }}>
              <span className="material-symbols-rounded flex items-center justify-center">search</span>
            </InputIcon>
            <InputText
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shadow-none focus:border-[#555555]"
            />
          </IconField>
        </div>
      </section>

      <section>
        <DataTable
          value={filteredStockItems}
          style={{ overflow: 'auto' }}
          showGridlines={false}
          rowHover
          rowClassName={getRowClassName}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 15, 20]}
          pt={{
            root: { className: 'datatable dark:datatable' },
            header: { className: 'p-datatable-thead dark:p-datatable-thead' }
          }}
          onRowClick={(e) => {
            const item = e.data as ProductStockItem;
            setEditingItem(item);
            setEditForm({ purity: item.purity, status: item.status });
            setEditModalOpen(true);
          }}
        >
          <Column header="#" body={(_: ProductStockItem, options: { rowIndex?: number }) => (options.rowIndex ?? 0) + 1} style={{ width: '3rem' }} />
          <Column field="stockId" header="Stock ID" />
          <Column
            header="Purity"
            field="purity"
          />
          <Column
            field="added"
            header="Added"
            body={(row: ProductStockItem) => formatDateTime(row.added)}
          />
          <Column
            field="lastModified"
            header="Last Modified"
            body={(row: ProductStockItem) => formatDateTime(row.lastModified)}
          />
          <Column
            header="Status"
            body={(row: ProductStockItem) => (
              <div onClick={(e) => e.stopPropagation()}>
                <Dropdown
                  value={row.status}
                  options={STATUS_OPTIONS}
                  onChange={(e) => handleUpdateStockField(row, { status: e.value })}
                  className="w-full"
                  pt={{ root: { className: 'w-7rem' } }}
                />
              </div>
            )}
          />
        </DataTable>
      </section>

      <Dialog
        header={editingItem?.stockId ?? 'Modify Stock'}
        visible={editModalOpen}
        onHide={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        style={{ width: 'min(480px, 95vw)' }}
        pt={{ root: { className: 'rounded-lg' }, header: { className: 'py-4 border-b border-[#CCCCCC] text-secondary-900 dark:text-white text-xl font-semibold' }, content: { className: 'px-4 py-5' }, footer: { className: 'p-4 border-t border-[#CCCCCC] m-0 flex gap-2 justify-between items-center' } }}
        footer={
          <div className="flex w-full justify-between items-center">
            <Button
              text
              severity="danger"
              onClick={handleDeleteStock}
              style={{ ...BUTTON_STYLES.iconButton, height: '32px', width: '32px' }}
            >
              <span className="material-symbols-rounded text-red-600">delete</span>
            </Button>
            <Button
              style={BUTTON_STYLES.primaryButton}
              onClick={handleEditSave}
            >
              <span className="material-symbols-rounded text-white mr-1" style={{ fontSize: '18px', fontWeight: 400 }}>
                check
              </span>
              <span>Done</span>
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="font-semibold text-secondary-900 dark:text-white">
            Modify Stock Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                Purity *
              </label>
              <Dropdown
                value={editForm.purity}
                options={PURITY_OPTIONS}
                onChange={(e) => setEditForm((f) => ({ ...f, purity: e.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                Status *
              </label>
              <Dropdown
                value={editForm.status}
                options={STATUS_OPTIONS}
                onChange={(e) => setEditForm((f) => ({ ...f, status: e.value }))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Scan / Add New Stock"
        visible={addStockModalOpen}
        onHide={() => {
          setAddStockModalOpen(false);
          setManualForm({ stockId: '', purity: '18K', status: 'In Shop' });
        }}
        style={{ width: 'min(480px, 95vw)' }}
        pt={{
          root: { className: 'rounded-lg' },
          header: { className: 'py-4 border-b border-[#CCCCCC] text-secondary-900 dark:text-white' },
          content: { className: 'px-4 py-5' },
          footer: { className: 'p-4 border-t border-[#CCCCCC] m-0 flex gap-2 justify-end' },
        }}
        footer={
          <div className="flex w-full justify-end">
            <Button style={BUTTON_STYLES.primaryButton} onClick={handleManualAdd}>
              <span className="material-symbols-rounded text-white mr-1" style={{ fontSize: '18px', fontWeight: 400 }}>
                check
              </span>
              <span>Done</span>
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-start bg-green-50 rounded-lg p-4">
            <span className="material-symbols-rounded text-[#0f5132] text-2xl">
              qr_code_scanner
            </span>
            <div>
              <div className="font-semibold text-[#0f5132]">Scan Now</div>
              <div className="text-sm text-[#0f5132]">
                Use the barcode scanner and scan the barcode on your product&apos;s tag
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                Stock ID *
              </label>
              <InputText
                value={manualForm.stockId}
                onChange={(e) => setManualForm((f) => ({ ...f, stockId: e.target.value }))}
                placeholder="Scan or Enter Manually"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                Purity *
              </label>
              <Dropdown
                value={manualForm.purity}
                options={PURITY_OPTIONS}
                onChange={(e) => setManualForm((f) => ({ ...f, purity: e.value }))}
                className="w-full"
                placeholder="Select"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default ProductStockPage;
