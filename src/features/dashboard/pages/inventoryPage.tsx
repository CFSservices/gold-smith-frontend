import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { DataTable, type DataTableRowClickEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { jewelProductService } from '@/api/services/jewelProduct.service';
import type {
  InventoryJewelProduct,
  JewelFormState,
  JewelModalView,
  JewelModalType,
  ProductImage,
} from '@/types/jewelProduct.types';
import { normalizeProductImages } from '@/utils/jewelProductUtils';
import {
  validateJewelForm,
} from '@/utils/jewelValidation';
import { JewelProductModal, NameWeightPriceCell, ActionCell } from '@/components/jewels/inventoryUI';
import { formatDateTime } from '@/utils/dateUtils';
import type { FileUpload, FileUploadFile } from 'primereact/fileupload';
import { BUTTON_STYLES, DATA_TABLE_DARK_PT } from '@/config/inventoryStyles';
import { env } from '@/config/env';

const TAB_OPTIONS = [
  { label: 'All', value: 0 },
  { label: 'Published', value: 1 },
  { label: 'Archived', value: 2 },
];

const MOCK_PRODUCTS: InventoryJewelProduct[] = [
  {
    id: 1,
    name: 'Jewel 1',
    category: 'Ring',
    price: 1000,
    stock: 10,
    images: [
      { url: 'image1.jpg', name: 'image1.jpg', size: 0 },
      { url: 'image2.jpg', name: 'image2.jpg', size: 0 },
    ],
    collection: 'Trending',
    createdAt: '13-02-2026',
    updatedAt: '13-02-2026',
    publishedOn: '13-02-2026',
    status: 'published',
    archivedAt: null,
    description: '',
    certifications: [],
    createdBy: '',
    updatedBy: '',
  },
  {
    id: 2,
    name: 'Jewel 2',
    category: 'Necklace',
    price: 2000,
    stock: 20,
    images: [
      { url: 'image3.jpg', name: 'image3.jpg', size: 0 },
      { url: 'image4.jpg', name: 'image4.jpg', size: 0 },
    ],
    collection: 'Exotic',
    createdAt: '13-02-2026',
    updatedAt: '15-02-2026',
    publishedOn: '13-02-2026',
    status: 'archived',
    archivedAt: '15-02-2026',
    description: '',
    certifications: [],
    createdBy: '',
    updatedBy: '',
  },
];

function getInitialFormState(): JewelFormState {
  return {
    jewelName: '',
    jewelDescription: '',
    metal: '',
    category: '',
    price: '',
    collection: '',
    publishedOn: new Date(),
    jewelSpecs: [],
    formStatus: true,
    archivedAt: null,
    images: [],
  };
}

function createEmptySpec(): { id: string; name: string; value: string } {
  return { id: crypto.randomUUID(), name: '', value: '' };
}

/** Build full image URL for relative paths */
function toFullImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const apiRoot = env.apiBaseUrl.replace('/api', '');
  return `${apiRoot}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** Backend API returns { data: { items: [...], pagination } } - extract product list */
function extractProductList(response: unknown): unknown[] {
  const data = (response as { data?: unknown })?.data;
  if (!data) return [];
  const raw =
    (data as { data?: unknown[] })?.data ??
    (data as { items?: unknown[] })?.items ??
    (Array.isArray(data) ? data : []);
  return Array.isArray(raw) ? raw : [];
}

/** Map backend product shape (product_id, product_name, etc.) to InventoryJewelProduct */
function mapBackendProductToInventory(p: Record<string, unknown>): InventoryJewelProduct {
  const metaDetails = (p.product_catalog_details ?? {}) as Record<string, unknown>;
  const id = (p.product_id ?? p.id ?? metaDetails.product_id ?? metaDetails.id ?? 0) as number | string;
  // console.log('metaDetails:', metaDetails);
  const name = (metaDetails.product_name ?? metaDetails.name ?? '') as string;
  const description = (metaDetails.product_description ?? metaDetails.description ?? '') as string;
  const createdAt = (p.createdAt ?? p.created_at ?? '') as string;
  const updatedAt = (p.updatedAt ?? p.updated_at ?? '') as string;
  const specDetails = metaDetails.product_specification as { name?: string; value?: string }[];
  // console.log('specDetails:', specDetails, typeof specDetails);
  const specifications =
  typeof metaDetails.product_specification === "string"
    ? JSON.parse(metaDetails.product_specification)
    : metaDetails.product_specification || [];
  // console.log('specifications:', specifications);
  const productslist =  {
    id,
    name,
    description,
    metal: String(metaDetails.product_metal ?? metaDetails.product_metal_type ?? '').toLowerCase(),
    price: (metaDetails.unit_price ?? metaDetails.product_price ?? 0) as number,
    stock: (metaDetails.stock ?? metaDetails.stock_count ??  0) as number,
    weight: (metaDetails.weight ?? 0) as number,
    images: normalizeProductImages(metaDetails.product_images),
    category: (metaDetails.category ?? metaDetails.product_category ?? '') as string,
    collection: (metaDetails.collection ?? metaDetails.product_collection ?? '') as string,
    certifications: (Array.isArray(metaDetails.product_certifications) ? metaDetails.product_certifications : []) as string[],
    publishedOn: (metaDetails.publishedOn ?? metaDetails.product_publish_on ?? metaDetails.updatedAt ?? metaDetails.updated_at ?? metaDetails.createdAt ?? metaDetails.created_at ?? '') as string,
    createdAt,
    updatedAt,
    createdBy: (metaDetails.createdBy ?? metaDetails.created_by ?? '') as string,
    updatedBy: (metaDetails.updatedBy ?? metaDetails.updated_by ?? '') as string,
    status: String(metaDetails.product_status).toLowerCase() === 'archived' ? 'archived' : 'published',
    archivedAt: (metaDetails.archivedAt ?? p.updatedAt ?? null) as string | null,
    specs: (specifications ?? []) as { name?: string; value?: string }[],
  };
  // console.log('productslist:', productslist);
  return productslist as InventoryJewelProduct;
}

function mapProductToFormState(product: InventoryJewelProduct): Partial<JewelFormState> {
  // console.log('product:', product);
  const specs = product.specifications ?? product.specs ?? [];
  const rawMetal = (product as InventoryJewelProduct & { metal?: string }).metal ?? '';
  return {
    jewelName: product.name ?? '',
    jewelDescription: product.description ?? '',
    metal: String(rawMetal).toLowerCase(),
    category: product.category?.toLowerCase() ?? '',
    price: product.price?.toString() ?? '',
    collection: product.collection?.toLowerCase().replace(/\s+/g, ' ') ?? '',
    publishedOn: product.publishedOn
      ? new Date(product.publishedOn)
      : product.updatedAt
        ? new Date(product.updatedAt)
        : new Date(),
    jewelSpecs: Array.isArray(specs)
      ? specs.map((s: { name?: string; value?: string }) => ({
          id: crypto.randomUUID(),
          name: s.name ?? '',
          value: s.value ?? '',
        }))
      : [],
    formStatus: product.status !== 'archived',
    archivedAt: product.archivedAt ? new Date(product.archivedAt) : null,
    images: product.images ?? []
  };
}

export function InventoryPage() {
  const [tabValue, setTabValue] = useState(0);
  const [inventoryProducts, setInventoryProducts] = useState<InventoryJewelProduct[]>(MOCK_PRODUCTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalView, setModalView] = useState<JewelModalView>('form');
  const [modalType, setModalType] = useState<JewelModalType>('new');
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [formState, setFormState] = useState<JewelFormState>(getInitialFormState);
  const [selectedProduct, setSelectedProduct] = useState<InventoryJewelProduct | null>(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const toastRef = useRef<Toast>(null);
  const photosFileUploadRef = useRef<FileUpload>(null);
  const certificationsFileUploadRef = useRef<FileUpload>(null);
  /** Pending initial images to set when photos FileUpload mounts (edit flow). */
  const pendingInitialPhotosRef = useRef<ProductImage[]>([]);

  const onPhotosUploadReady = useCallback(() => {
    const pending = pendingInitialPhotosRef.current;
    if (pending.length === 0 || !photosFileUploadRef.current) return;
    const existingFiles = pending.map((img) => ({
      name: img.name,
      objectURL: toFullImageUrl(img.url),
      size: img.size,
    })) as unknown as FileUploadFile[];
    photosFileUploadRef.current.clear?.();
    photosFileUploadRef.current.setUploadedFiles?.(existingFiles);
    pendingInitialPhotosRef.current = [];
  }, []);

  useEffect(() => {
    jewelProductService
      .getJewelProducts()
      .then((response) => {
        // console.log('response all products:', response);
        const list = extractProductList(response);
        const items = list
          .map((p) => mapBackendProductToInventory(p as Record<string, unknown>))
        // console.log('items:', items);
        setInventoryProducts(items);
      })
      .catch(() => {
        /* keep initial mock on error */
      });
  }, []);

  const filteredProducts = useMemo(() => {
    // console.log('filteredProducts:', inventoryProducts);
    if (tabValue === 0) return inventoryProducts;
    if (tabValue === 1) return inventoryProducts.filter((p) => p.status === 'published');
    if (tabValue === 2) return inventoryProducts.filter((p) => p.status === 'archived');
    return inventoryProducts;
  }, [inventoryProducts, tabValue]);

  const resetForm = useCallback(() => {
    setFormState(getInitialFormState());
    photosFileUploadRef.current?.clear();
    certificationsFileUploadRef.current?.clear();
    setSelectedProduct(null);
    pendingInitialPhotosRef.current = [];
  }, []);

  const openNewModal = useCallback(() => {
    setModalType('new');
    setModalView('form');
    setFormState({
      ...getInitialFormState(),
      jewelSpecs: [createEmptySpec()],
    });
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((product: InventoryJewelProduct) => {
    setModalType('edit');
    setModalView('form');
    setSelectedProduct(product);
    pendingInitialPhotosRef.current = product.images?.length ? [...product.images] : [];
    const mapped = mapProductToFormState(product);
    const specs = Array.isArray(mapped.jewelSpecs) && mapped.jewelSpecs.length > 0 ? mapped.jewelSpecs : [createEmptySpec()];
    setFormState({ ...getInitialFormState(), ...mapped, jewelSpecs: specs });
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalView('form');
    resetForm();
  }, [resetForm]);

  const handleStatusToggle = useCallback(
    async (productId: string | number, newStatus: boolean) => {
      const idStr = String(productId);
      if (!idStr || idStr === 'undefined' || idStr === 'null' || idStr === 'NaN') {
        toastRef.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid product ID.',
        });
        return;
      }
      const newStatusStr = newStatus ? 'published' : 'archived';
      const previousStatus = newStatusStr === 'published' ? 'archived' : 'published';

      // Optimistic update (works with string or number ids)
      setInventoryProducts((prev) =>
        prev.map((p) =>
          String(p.id) === idStr ? { ...p, status: newStatusStr } : p
        )
      );

      try {
        const formData = new FormData();
        formData.append('product_status', newStatusStr);
        await (newStatusStr === 'published' 
          ? jewelProductService.publishJewelProduct(idStr) 
          : jewelProductService.archiveJewelProduct(idStr));
        toastRef.current?.show({
          severity: 'success',
          summary: 'Status updated',
          detail: `Product ${newStatusStr === 'published' ? 'published' : 'archived'}.`,
        });
      } catch (err) {
        setInventoryProducts((prev) =>
          prev.map((p) =>
            String(p.id) === idStr ? { ...p, status: previousStatus } : p
          )
        );
        const message = err instanceof Error ? err.message : 'Failed to update status.';
        toastRef.current?.show({ severity: 'error', summary: 'Error', detail: message });
      }
    },
    []
  );

  const onPhotosBeforeSelect = useCallback((event: { files: File[] }) => {
    const currentCount = photosFileUploadRef.current?.getFiles()?.length ?? 0;
    if (currentCount + event.files.length > 10) {
      toastRef.current?.show({
        severity: 'warn',
        summary: 'Limit',
        detail: 'Maximum 10 photos allowed.',
      });
      return false;
    }
    return true;
  }, []);

  const onCertificationsBeforeSelect = useCallback((event: { files: File[] }) => {
    const currentCount = certificationsFileUploadRef.current?.getFiles()?.length ?? 0;
    if (currentCount + event.files.length > 10) {
      toastRef.current?.show({
        severity: 'warn',
        summary: 'Limit',
        detail: 'Maximum 10 certification files allowed.',
      });
      return false;
    }
    return true;
  }, []);

  const handleSave = useCallback(async () => {
    const uploadedPhotoItems =
      (photosFileUploadRef.current?.getUploadedFiles?.() ?? []) as { url?: string; name?: string }[];
    // console.log('new ones:', uploadedPhotoItems)
    const pendingPhotoItems =
      (photosFileUploadRef.current?.getFiles() ?? []) as (File | { objectURL?: string })[];
      // console.log('pending ones:', pendingInitialPhotosRef)
    const photoFiles = pendingPhotoItems.filter((f): f is File => f instanceof File);
    // console.log('final pending:', photoFiles)
    const result = validateJewelForm(
      {
        jewelName: formState.jewelName,
        metal: formState.metal,
        category: formState.category,
        price: formState.price,
        jewelDescription: formState.jewelDescription,
        jewelSpecs: formState.jewelSpecs,
        collection: formState.collection,
        publishedOn: formState.publishedOn,
      },
      { mode: modalType, photoCount: uploadedPhotoItems.length + pendingPhotoItems.length }
    );
    // console.log("result validation:", result);
    if (!result.valid) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: result.error,
      });
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append('product_name', formState.jewelName);
    formData.append('product_description', formState.jewelDescription);
    formData.append('product_metal_type', formState.metal);
    formData.append('product_category', formState.category);
    formData.append('product_price', formState.price);
    formData.append('product_collection', formState.collection);
    formData.append(
      'product_publish_on',
      formState.publishedOn ? new Date(formState.publishedOn).toISOString() : ''
    );
    formData.append(
      'product_specification',
      JSON.stringify(
        formState.jewelSpecs
          .filter((s) => s.name.trim() && s.value.trim())
          .map(({ name, value }) => ({ name, value }))
      )
    );
    const productStatusStr = formState.formStatus ? 'published' : 'archived';
    formData.append('product_status', productStatusStr);
    if (modalType === 'edit') {
      if (formState.archivedAt) formData.append('archivedAt', new Date(formState.archivedAt).toISOString());
      // Include currently visible existing images as URLs (respecting removals in the UI)
      // console.log('selected row:', selectedProduct);
      if (selectedProduct?.images?.length) {
        const uploadedObjectUrls = new Set(
          uploadedPhotoItems
            .map((f) => f.url)
            .filter((u): u is string => Boolean(u))
        );
        const existingImageUrls = selectedProduct.images
          .filter((img) => uploadedObjectUrls.has(toFullImageUrl(img.url)))
          .map((img) => img.url);
        existingImageUrls.forEach((url) => {
          formData.append('product_images', url);
        });
      }
    }
    photoFiles.forEach((file) => formData.append('product_images', file));
    (certificationsFileUploadRef.current?.getFiles() ?? []).forEach((file) =>
      formData.append('product_certifications', file as File)
    );

    try {
      if (modalType === 'new') {
        // console.log('formData for new jewel:', Array.from(formData.entries()));
        // console.log('product images:', formData.get('product_images'));
        await jewelProductService.createJewelProduct(formData);
        toastRef.current?.show({
          severity: 'success',
          summary: 'Created',
          detail: 'Jewel created successfully.',
        });
      } else if (selectedProduct?.id) {
        // console.log('formData for updated jewel:', Array.from(formData.entries()));
        await jewelProductService.updateJewelProduct(String(selectedProduct.id), formData);
        toastRef.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Jewel updated successfully.',
        });
      }
      const res = await jewelProductService.getJewelProducts();
      const list = extractProductList(res);
      const items = list
        .map((p) => mapBackendProductToInventory(p as Record<string, unknown>))
        .map((p) => ({
          ...p,
          publishedOn: p.publishedOn ?? p.updatedAt ?? p.createdAt,
          archivedAt: p.status === 'archived' ? (p.archivedAt ?? p.updatedAt) : null,
        }));
      setInventoryProducts(items);
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save jewel.';
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: message });
    } finally {
      setSaving(false);
    }
  }, [formState, modalType, selectedProduct, closeModal]);

  const handleArchiveConfirm = useCallback(() => {
    setFormState((prev) => ({ ...prev, formStatus: false, archivedAt: new Date() }));
    setModalView('form');
  }, []);

  const handleRowClick = useCallback(
    (event: DataTableRowClickEvent) => {
      // console.log('event.data:', event.data);
      if (event.data) openEditModal(event.data as InventoryJewelProduct);
    },
    [openEditModal]
  );

  const handleBookClick = useCallback(
    (product: InventoryJewelProduct) => {
      navigate(`/jewels/inventory/${product.id}`);
    },
    [navigate]
  );

  const serialNumberBodyTemplate = (_rowData: InventoryJewelProduct, options: { rowIndex?: number }): number => (options.rowIndex ?? 0) + 1;
  
  return (
    <div className="body dark:body h-full">
      <Toast ref={toastRef} />
      <section className="flex items-center justify-between py-2 px-3">
        <div className="flex items-center">
          <div>
            <Button
              text
              style={{ ...BUTTON_STYLES.iconButton, height: '32px', width: '32px', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => navigate('/jewels')}
            >
              <span
                className="material-symbols-rounded text-[#704F01] dark:text-white font-light text-2xl"
              >
                chevron_left
              </span>
            </Button>
          </div>
          <div className="px-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white m-0">Inventory</h1>
            </div>
            <p className="m-0 text-secondary-900 dark:text-white">Inventory</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button style={BUTTON_STYLES.primaryButton} onClick={openNewModal}>
            <span
              className="material-symbols-rounded text-white"
              style={{ fontSize: '16px', fontWeight: '400' }}
            >
              add_circle
            </span>
            <p className="m-0 text-base">New Jewel</p>
          </Button>
        </div>
      </section>
      <hr className="m-0"/>

      {modalOpen && (
        <JewelProductModal
          visible={modalOpen}
          view={modalView}
          modalType={modalType}
          formState={formState}
          onFormChange={(updates) => setFormState((prev) => ({ ...prev, ...updates }))}
          selectedProduct={selectedProduct}
          previewImageIndex={previewImageIndex}
          onPreviewImageIndexChange={setPreviewImageIndex}
          saving={saving}
          photosUploadRef={photosFileUploadRef}
          certificationsUploadRef={certificationsFileUploadRef}
          onPhotosBeforeSelect={onPhotosBeforeSelect}
          onCertificationsBeforeSelect={onCertificationsBeforeSelect}
          onPhotosUploadReady={onPhotosUploadReady}
          onSave={handleSave}
          onClose={closeModal}
          onViewChange={setModalView}
          onArchiveConfirm={handleArchiveConfirm}
        />
      )}

      <section className="flex items-center justify-between px-4 py-3 h-19.5">
        <div className="text-[#545455]">
          <SelectButton
            value={tabValue}
            options={TAB_OPTIONS}
            onChange={(e) => setTabValue(e.value)}
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
        </div>
        <div className="grid lg:flex items-center justify-center gap-4">
          <div>
            <Button text style={{ ...BUTTON_STYLES.iconButton, fontSize: '32px' }}>
              <span
                className="material-symbols-rounded text-[#704F01] dark:text-white"
                style={{ fontSize: '28px', fontWeight: '400' }}
              >
                download
              </span>
            </Button>
          </div>
          <div>
            <Button text style={{ ...BUTTON_STYLES.iconButton, fontSize: '32px' }}>
              <span
                className="material-symbols-rounded text-[#704F01] dark:text-white"
                style={{ fontSize: '28px', fontWeight: '400' }}
              >
                filter_alt
              </span>
            </Button>
          </div>
          <div className="flex items-center">
            <IconField iconPosition="left" pt={{ root: { className: 'border-lg' } }}>
              <InputIcon pt={{ root: { className: 'flex items-center top-2/5' } }}>
                <span className="material-symbols-rounded flex items-center justify-center"> search </span>
              </InputIcon>
              <InputText placeholder="Search" className="shadow-none focus:border-[#555555]" />
            </IconField>
          </div>
        </div>
      </section>

      <section>
        <DataTable
          value={filteredProducts}
          style={{ overflow: 'auto' }}
          showGridlines={false}
          rowHover
          onRowClick={handleRowClick}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 15, 20]}
          pt={{
            root: { className: 'datatable dark:datatable' },
            header: { className: 'p-datatable-thead dark:p-datatable-thead' },
          }}
        >
          <Column header="S.No" style={{ width: '3rem' }} body={serialNumberBodyTemplate} />
          <Column
            header="Name, Weight & Price"
            body={(rowData: InventoryJewelProduct) => <NameWeightPriceCell rowData={rowData} />}
          />
          <Column field="stock" header="Stock" />
          <Column field="collection" header="Collections" />
          <Column
            field="createdAt"
            header="Created"
            body={(row: InventoryJewelProduct) => formatDateTime(row.createdAt)}
          />
          <Column
            field="updatedAt"
            header="Last Modified"
            body={(row: InventoryJewelProduct) => formatDateTime(row.updatedAt)}
          />
          <Column
            header="Actions"
            body={(rowData: InventoryJewelProduct) => (
              <ActionCell rowData={rowData} onStatusToggle={handleStatusToggle} onBookClick={handleBookClick} />
            )}
          />
        </DataTable>
      </section>
    </div>
  );
}

export default InventoryPage;
