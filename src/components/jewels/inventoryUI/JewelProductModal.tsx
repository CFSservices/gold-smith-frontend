import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import type { JewelFormState, JewelModalView, JewelModalType, InventoryJewelProduct } from '@/types/jewelProduct.types';
import { METAL_OPTIONS } from '@/types/jewelProduct.types';
import { JewelProductForm } from './JewelProductForm';
import type { FileUpload } from 'primereact/fileupload';
import { BUTTON_STYLES, INVENTORY_THEME } from '@/config/inventoryStyles';

const DIALOG_PT = {
  root: { className: 'w-1/2 rounded-lg lg:lh-[640px] lg:w-[720px]' },
  header: { className: 'py-4 border-b border-[#CCCCCC] text-secondary-900' },
  closeButton: { className: 'text-[#555555] rounded-lg' },
  content: { className: 'px-4 py-5' },
  footer: { className: 'p-4 border-t border-[#CCCCCC] m-0' },
};

export interface JewelProductModalProps {
  visible: boolean;
  view: JewelModalView;
  modalType: JewelModalType;
  formState: JewelFormState;
  onFormChange: (updates: Partial<JewelFormState>) => void;
  selectedProduct: InventoryJewelProduct | null;
  previewImageIndex: number;
  onPreviewImageIndexChange: (index: number) => void;
  saving: boolean;
  photosUploadRef: React.RefObject<FileUpload | null>;
  certificationsUploadRef: React.RefObject<FileUpload | null>;
  onPhotosBeforeSelect?: (event: { files: File[] }) => boolean;
  onCertificationsBeforeSelect?: (event: { files: File[] }) => boolean;
  /** Called when the photos FileUpload has mounted (so parent can set initial files in edit flow). */
  onPhotosUploadReady?: () => void;
  onSave: () => void;
  onClose: () => void;
  onViewChange: (view: JewelModalView) => void;
  onArchiveConfirm: () => void;
}

export function JewelProductModal({
  visible,
  view,
  modalType,
  formState,
  onFormChange,
  selectedProduct,
  previewImageIndex,
  onPreviewImageIndexChange,
  saving,
  photosUploadRef,
  certificationsUploadRef,
  onPhotosBeforeSelect,
  onCertificationsBeforeSelect,
  onPhotosUploadReady,
  onSave,
  onClose,
  onViewChange,
  onArchiveConfirm,
}: JewelProductModalProps) {
  const pendingFiles = (photosUploadRef.current?.getFiles() ?? []) as { objectURL?: string; name?: string }[];
  const uploadedFiles = (photosUploadRef.current?.getUploadedFiles?.() ?? []) as { objectURL?: string; name?: string }[];
  const previewFiles = [...pendingFiles, ...uploadedFiles];

  const header =
    view === 'preview' ? (
      <div className="flex items-center justify-between w-full gap-2">
        <span className="text-secondary-900 dark:text-white font-semibold">Preview</span>
        {modalType === 'edit' &&
          (formState.formStatus ? (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              Published
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              Archived
            </span>
          ))}
      </div>
    ) : view === 'archiveConfirm' ? (
      <div className="flex items-center justify-between w-full gap-2">
        <span className="text-secondary-900 dark:text-white font-semibold">Archive Jewel</span>
      </div>
    ) : modalType === 'new' ? (
      <div className="flex items-center justify-between w-full gap-2">
        <span className="text-secondary-900 dark:text-white font-semibold">New Jewel</span>
      </div>
    ) : (
      <div className="flex items-center justify-between w-full gap-2">
        <span className="text-secondary-900 dark:text-white font-semibold">Edit Jewel{selectedProduct ? `: ${selectedProduct.name}` : ''}</span>
      </div>
    );

  const footer =
    view === 'preview'
      ? null
      : view === 'archiveConfirm'
        ? (
          <div className="flex items-center justify-end gap-3">
            <Button
              text
              style={{
                ...BUTTON_STYLES.primaryButton,
                padding: '8px 12px',
                borderRadius: '6px',
                gap: '4px',
              }}
              onClick={() => onViewChange('form')}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>
                close
              </span>
              <p className="m-0 text-base">Don&apos;t Archive</p>
            </Button>
            <Button
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: INVENTORY_THEME.danger,
                color: 'white',
                border: 'none',
                boxShadow: 'none',
              }}
              onClick={onArchiveConfirm}
            >
              <p className="m-0 text-base">Archive</p>
            </Button>
          </div>
        )
        : (
          <>
            {modalType === 'edit' && (
              <div className="flex items-center justify-between">
                <div>
                  <Button
                    text
                    style={{ ...BUTTON_STYLES.iconButton, margin: 0 }}
                    severity="danger"
                    onClick={() => onViewChange('archiveConfirm')}
                    disabled={selectedProduct?.status === "archived"}
                  >
                    <span
                      className="material-symbols-rounded text-700"
                      style={{ fontSize: '28px', fontWeight: '400' }}
                    >
                      archive
                    </span>
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:flex items-center justify-end gap-4">
                  <Button
                    text
                    style={BUTTON_STYLES.secondaryButton}
                    onClick={() => {
                      onViewChange('preview');
                      onPreviewImageIndexChange(0);
                    }}
                  >
                    <span
                      className="material-symbols-rounded text-700"
                      style={{ fontSize: '28px', fontWeight: '400' }}
                    >
                      visibility
                    </span>
                    <p className="m-0 text-base">Preview</p>
                  </Button>
                  <Button
                    text
                    disabled={saving}
                    loading={saving}
                    style={BUTTON_STYLES.saveButton}
                    onClick={onSave}
                  >
                    <span
                      className="material-symbols-rounded text-700"
                      style={{ fontSize: '28px', fontWeight: '400' }}
                    >
                      save
                    </span>
                    <p className="m-0 text-base">Save and Close</p>
                  </Button>
                </div>
              </div>
            )}
            {modalType === 'new' && (
              <div className="flex items-center justify-between">
                <Button
                  text
                  style={BUTTON_STYLES.secondaryButton}
                  onClick={() => {
                    onViewChange('preview');
                    onPreviewImageIndexChange(0);
                  }}
                >
                  <span
                    className="material-symbols-rounded text-700"
                    style={{ fontSize: '28px', fontWeight: '400' }}
                  >
                    visibility
                  </span>
                  <p className="m-0 text-base">Preview</p>
                </Button>
                <Button
                  text
                  disabled={saving}
                  loading={saving}
                  style={BUTTON_STYLES.saveButton}
                  onClick={onSave}
                >
                  <span
                    className="material-symbols-rounded text-700"
                    style={{ fontSize: '28px', fontWeight: '400' }}
                  >
                    save
                  </span>
                  <p className="m-0 text-base">Save and Close</p>
                </Button>
              </div>
            )}
          </>
        );

  return (
    <Dialog
      header={header}
      footer={footer}
      visible={visible}
      onHide={view === 'preview' ? () => onViewChange('form') : onClose}
      pt={DIALOG_PT}
    >
      {view === 'preview' && (
        <div className="grid grid-cols-1 gap-4">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white mt-0 mb-2">
            {formState.jewelName || 'Untitled'}
          </h2>
          {previewFiles.length > 0 ? (
            <Carousel
              value={previewFiles}
              circular
              page={previewImageIndex}
              onPageChange={(e) => onPreviewImageIndexChange(e.page)}
              showNavigators
              showIndicators
              numVisible={1}
              numScroll={1}
              itemTemplate={(item) => (
                <div className="relative w-[320px] h-[320px] mx-auto bg-[#faf8f5] dark:bg-[#2a2a2a] rounded-lg overflow-hidden flex items-center justify-center border border-[#CCCCCC]">
                  <img
                    src={item.objectURL}
                    alt={formState.jewelName || 'Preview'}
                    className="max-w-full max-h-full object-contain w-full"
                  />
                </div>
              )}
              className="w-full"
              pt={{
                content: {
                  className: 'flex items-center justify-center',
                },
                indicators: {
                  className: 'p-2',
                },
                nextButton: {
                  className: 'h-8 w-8 rounded-full',
                },
                previousButton: {
                  className: 'h-8 w-8 rounded-full',
                },
                header: {
                  className: 'text-secondary-900 dark:text-white',
                }
              }}
            />
          ) : (
            <div className="w-[320px] h-[320px] mx-auto bg-[#faf8f5] dark:bg-[#2a2a2a] rounded-lg flex items-center justify-center text-[#555555] dark:text-gray-400">
              No photos
            </div>
          )}
          <div className="grid gap-2">
            <h4 className="text-sm font-semibold text-secondary-900 dark:text-white m-0">Purity</h4>
            <p className="m-0 text-secondary-900 dark:text-white">
              {(METAL_OPTIONS.find((o) => o.value === formState.metal)?.label ?? formState.metal) || '—'}
            </p>
          </div>
          <div className="grid gap-2">
            <h4 className="text-sm font-semibold text-secondary-900 dark:text-white m-0">Description</h4>
            <p className="m-0 text-secondary-900 dark:text-white whitespace-pre-wrap">
              {formState.jewelDescription || '—'}
            </p>
          </div>
          {formState.jewelSpecs.some((s) => s.name.trim() || s.value.trim()) && (
            <div className="grid gap-2">
              <h4 className="text-sm font-semibold text-secondary-900 dark:text-white m-0">Jewel Details</h4>
              <ul className="m-0 pl-4 list-disc">
                {formState.jewelSpecs
                  .filter((s) => s.name.trim() || s.value.trim())
                  .map((spec) => (
                    <li key={spec.id} className="text-secondary-900 dark:text-white">
                      {spec.name}: {spec.value}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {view === 'archiveConfirm' && (
        <div className="grid grid-cols-1 gap-4">
          <p className="m-0 text-secondary-900 dark:text-white">
            Are you sure you want to archive the jewel{' '}
            <strong>&quot;{formState.jewelName || selectedProduct?.name || 'Untitled'}&quot;</strong>?
          </p>
          <p className="m-0 text-secondary-900 dark:text-white">
            By archiving, your users will not be able to see this item in their jewels list.
          </p>
          <p className="m-0 text-secondary-900 dark:text-white">
            You can still move it back to &quot;Published&quot; to let users see in their jewels list.
          </p>
          <div className="mt-2">
            <p className="m-0 text-sm font-semibold text-secondary-900 dark:text-white">Note:</p>
            <p className="m-0 text-sm text-secondary-900 dark:text-white mt-1">
              If the product is in cart, it will be mentioned &quot;Not available&quot; and user has to choose some
              other jewel to purchase.
            </p>
          </div>
        </div>
      )}

      {/* Keep form mounted when switching to preview/archive so FileUpload state (photos, certifications) is preserved */}
      <div style={{ display: view === 'form' ? 'block' : 'none' }}>
        <JewelProductForm
          mode={modalType}
          state={formState}
          onChange={onFormChange}
          photosUploadRef={photosUploadRef}
          certificationsUploadRef={certificationsUploadRef}
          onPhotosBeforeSelect={onPhotosBeforeSelect}
          onCertificationsBeforeSelect={onCertificationsBeforeSelect}
          onPhotosUploadReady={onPhotosUploadReady}
        />
      </div>
    </Dialog>
  );
}
