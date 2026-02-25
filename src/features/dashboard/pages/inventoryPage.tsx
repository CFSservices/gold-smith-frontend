import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
} from '@/types/jewelProduct.types';
import {
  validateJewelForm,
} from '@/utils/jewelValidation';
import { JewelProductModal, NameWeightPriceCell, ActionCell } from '@/features/dashboard/components/inventory';
import type { FileUpload } from 'primereact/fileupload';
import type { ApiResponse, PaginatedResponse } from '@/types';
import { BUTTON_STYLES } from '@/config/inventoryStyles';

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
    images: ['image1.jpg', 'image2.jpg'],
    collection: 'Trending',
    createdAt: '13-02-2026',
    updatedAt: '13-02-2026',
    publishedOn: '13-02-2026',
    status: true,
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
    images: ['image3.jpg', 'image4.jpg'],
    collection: 'Exotic',
    createdAt: '13-02-2026',
    updatedAt: '15-02-2026',
    publishedOn: '13-02-2026',
    status: false,
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
  };
}

function createEmptySpec(): { id: string; name: string; value: string } {
  return { id: crypto.randomUUID(), name: '', value: '' };
}

function mapProductToFormState(product: InventoryJewelProduct): Partial<JewelFormState> {
  const specs = product.specifications ?? product.specs ?? [];
  return {
    jewelName: product.name ?? '',
    jewelDescription: product.description ?? '',
    metal: (product as InventoryJewelProduct & { metal?: string }).metal ?? product.category ?? '',
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
    formStatus: product.status !== false,
    archivedAt: product.archivedAt ? new Date(product.archivedAt) : null,
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

  const toastRef = useRef<Toast>(null);
  const photosFileUploadRef = useRef<FileUpload>(null);
  const certificationsFileUploadRef = useRef<FileUpload>(null);

  useEffect(() => {
    jewelProductService
      .getJewelProducts()
      .then((response: ApiResponse<PaginatedResponse<InventoryJewelProduct>>) => {
        const raw = response?.data?.data ?? (response as unknown as { data?: InventoryJewelProduct[] })?.data ?? response;
        const list = Array.isArray(raw) ? raw : (raw as { data?: InventoryJewelProduct[] })?.data ?? [];
        const items = (Array.isArray(list) ? list : []).map((p: InventoryJewelProduct) => ({
          ...p,
          publishedOn: p.publishedOn ?? p.updatedAt ?? p.createdAt,
          archivedAt: p.status === false ? (p.archivedAt ?? p.updatedAt) : null,
        }));
        setInventoryProducts(items);
      })
      .catch(() => {
        /* keep initial mock on error */
      });
  }, []);

  const filteredProducts = useMemo(() => {
    if (tabValue === 0) return inventoryProducts;
    if (tabValue === 1) return inventoryProducts.filter((p) => p.status === true);
    if (tabValue === 2) return inventoryProducts.filter((p) => p.status === false);
    return inventoryProducts;
  }, [inventoryProducts, tabValue]);

  const resetForm = useCallback(() => {
    setFormState(getInitialFormState());
    photosFileUploadRef.current?.clear();
    certificationsFileUploadRef.current?.clear();
    setSelectedProduct(null);
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

  const handleStatusToggle = useCallback((productId: number, newStatus: boolean) => {
    setInventoryProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
    );
  }, []);

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
    const photoFiles = (photosFileUploadRef.current?.getFiles() ?? []) as File[];
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
      { mode: modalType, photoCount: photoFiles.length }
    );
    console.log("result validation:", result);
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
    formData.append('name', formState.jewelName);
    formData.append('description', formState.jewelDescription);
    formData.append('metal', formState.metal);
    formData.append('category', formState.category);
    formData.append('price', formState.price);
    formData.append('collection', formState.collection);
    formData.append(
      'publishedOn',
      formState.publishedOn ? new Date(formState.publishedOn).toISOString() : ''
    );
    formData.append(
      'specifications',
      JSON.stringify(
        formState.jewelSpecs
          .filter((s) => s.name.trim() && s.value.trim())
          .map(({ name, value }) => ({ name, value }))
      )
    );
    if (modalType === 'edit') {
      formData.append('status', String(formState.formStatus));
      if (formState.archivedAt) formData.append('archivedAt', new Date(formState.archivedAt).toISOString());
    }
    photoFiles.forEach((file) => formData.append('images', file));
    (certificationsFileUploadRef.current?.getFiles() ?? []).forEach((file) =>
      formData.append('certifications', file as File)
    );

    try {
      if (modalType === 'new') {
        await jewelProductService.createJewelProduct(formData);
        toastRef.current?.show({
          severity: 'success',
          summary: 'Created',
          detail: 'Jewel created successfully.',
        });
      } else if (selectedProduct?.id) {
        await jewelProductService.updateJewelProduct(String(selectedProduct.id), formData);
        toastRef.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Jewel updated successfully.',
        });
      }
      const res = await jewelProductService.getJewelProducts();
      console.log('response all products:', res);
      const raw = (res as ApiResponse<PaginatedResponse<InventoryJewelProduct>>)?.data?.data ?? (res as unknown as { data?: InventoryJewelProduct[] })?.data ?? res;
      const list = Array.isArray(raw) ? raw : [];
      const items = list.map((p: InventoryJewelProduct) => ({
        ...p,
        publishedOn: p.publishedOn ?? p.updatedAt ?? p.createdAt,
        archivedAt: p.status === false ? (p.archivedAt ?? p.updatedAt) : null,
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
      if (event.data) openEditModal(event.data as InventoryJewelProduct);
    },
    [openEditModal]
  );

  return (
    <div>
      <Toast ref={toastRef} />
      <section className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div>
            <Button
              text
              style={{ ...BUTTON_STYLES.iconButton, height: '32px', width: '32px' }}
              onClick={() => window.history.back()}
            >
              <span
                className="material-symbols-rounded flex items-center justify-center-safe text-[#704F01] dark:text-white h-8 w-7 font-light text-2xl"
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
          onSave={handleSave}
          onClose={closeModal}
          onViewChange={setModalView}
          onArchiveConfirm={handleArchiveConfirm}
        />
      )}

      <hr className="mb-0" />
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
        >
          <Column field="id" header="#" style={{ width: '3rem' }} />
          <Column
            header="Name, Weight & Price"
            body={(rowData: InventoryJewelProduct) => <NameWeightPriceCell rowData={rowData} />}
          />
          <Column field="stock" header="Stock" />
          <Column field="collection" header="Collections" />
          <Column field="createdAt" header="Created" />
          <Column field="updatedAt" header="Last Modified" />
          <Column
            header="Actions"
            body={(rowData: InventoryJewelProduct) => (
              <ActionCell rowData={rowData} onStatusToggle={handleStatusToggle} />
            )}
          />
        </DataTable>
      </section>
    </div>
  );
}

export default InventoryPage;
