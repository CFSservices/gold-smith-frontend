import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import type { JewelFormState, JewelSpecItem } from '@/types/jewelProduct.types';
import { METAL_OPTIONS, CATEGORY_OPTIONS, COLLECTION_OPTIONS } from '@/types/jewelProduct.types';
import { toDateOnly } from '@/utils/dateUtils';
import { JEWEL_NAME_MAX_LENGTH } from '@/utils/jewelValidation';
import { useReorderableList } from '@/hooks/useReorderableList';
import { FileUpload } from '@/components/ui/FileUpload';
import type { FileUpload as PrimeFileUploadRef } from 'primereact/fileupload';

const INPUT_CLASS = 'w-full shadow-none hover:border-secondary-400 focus:border-[#704F01]';
const SECTION_HR_CLASS = 'mb-0 w-full border-[#CCCCCC]';
const SECTION_TITLE_CLASS = 'text-2xl font-bold text-secondary-900 dark:text-white mb-4 mt-0';
const LABEL_CLASS = 'text-sm text-secondary-900 dark:text-white m-0';

export interface JewelProductFormProps {
  mode: 'new' | 'edit';
  state: JewelFormState;
  onChange: (updates: Partial<JewelFormState>) => void;
  photosUploadRef: React.RefObject<PrimeFileUploadRef | null>;
  certificationsUploadRef: React.RefObject<PrimeFileUploadRef | null>;
  onPhotosBeforeSelect?: (event: { files: File[] }) => boolean;
  onCertificationsBeforeSelect?: (event: { files: File[] }) => boolean;
  /** Called when the photos FileUpload has mounted (so parent can set initial files). */
  onPhotosUploadReady?: () => void;
}

function createEmptySpec(): JewelSpecItem {
  return { id: crypto.randomUUID(), name: '', value: '' };
}

export function JewelProductForm({
  mode,
  state,
  onChange,
  photosUploadRef,
  certificationsUploadRef,
  onPhotosBeforeSelect,
  onCertificationsBeforeSelect,
  onPhotosUploadReady,
}: JewelProductFormProps) {
  const toastRef = useRef<Toast>(null);

  const update = (updates: Partial<JewelFormState>) => onChange(updates);

  const {
    draggedId,
    dragOverId,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
  } = useReorderableList({
    items: state.jewelSpecs,
    setItems: (updater) => {
      const next = typeof updater === 'function' ? updater(state.jewelSpecs) : updater;
      update({ jewelSpecs: next });
    },
    getItemId: (s) => s.id,
  });

  const addSpec = () => {
    update({ jewelSpecs: [...state.jewelSpecs, createEmptySpec()] });
  };

  const removeSpec = (id: string) => {
    update({ jewelSpecs: state.jewelSpecs.filter((s) => s.id !== id) });
  };

  const updateSpec = (id: string, field: 'name' | 'value', value: string) => {
    update({
      jewelSpecs: state.jewelSpecs.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) update({ price: val });
  };

  const pubDate = toDateOnly(state.publishedOn);
  const today = toDateOnly(new Date());
  const isPublishDateInFuture =
    mode === 'new' &&
    pubDate != null &&
    today != null &&
    pubDate.getTime() > today.getTime();

  return (
    <div className="grid grid-cols-1 gap-4">
      <Toast ref={toastRef} />

      <section>
        <h1 className={SECTION_TITLE_CLASS}>1. Name, Category & Price</h1>
        <div className="grid gap-2">
          <h4 className={LABEL_CLASS}>Jewel Name *</h4>
          <InputTextarea
            placeholder="Enter Jewel Name"
            value={state.jewelName}
            onChange={(e) =>
              update({
                jewelName: String(e.target.value).slice(0, JEWEL_NAME_MAX_LENGTH),
              })
            }
            rows={5}
            cols={30}
            maxLength={JEWEL_NAME_MAX_LENGTH}
            className={INPUT_CLASS}
          />
          <p className="text-xs text-secondary-900 dark:text-white m-0">
            {JEWEL_NAME_MAX_LENGTH - state.jewelName.length}/{JEWEL_NAME_MAX_LENGTH} letters left
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 lg:flex gap-4 w-full">
            <div className="w-full grid gap-2">
              <h4 className={LABEL_CLASS}>Metal *</h4>
              <Dropdown
                options={METAL_OPTIONS}
                optionLabel="label"
                optionValue="value"
                placeholder="Select Metal"
                value={state.metal}
                onChange={(e) => update({ metal: e.value })}
                pt={{ root: { className: INPUT_CLASS } }}
              />
            </div>
            <div className="w-full grid gap-2">
              <h4 className={LABEL_CLASS}>Category *</h4>
              <Dropdown
                options={CATEGORY_OPTIONS}
                optionLabel="label"
                optionValue="value"
                placeholder="Select Category"
                value={state.category}
                onChange={(e) => update({ category: e.value })}
                pt={{ root: { className: INPUT_CLASS } }}
              />
            </div>
          </div>
          <div className="w-1/2 grid gap-2">
            <h4 className={LABEL_CLASS}>Unit Price(₹) *</h4>
            <InputText
              placeholder="Enter Price"
              value={state.price}
              onChange={handlePriceChange}
              inputMode="decimal"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </section>

      <hr className={SECTION_HR_CLASS} />

      <section>
        <h1 className={SECTION_TITLE_CLASS}>2. Content</h1>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className={`${LABEL_CLASS} mb-2`}>Photos (Min 1, Max 10) *</h4>
            <FileUpload
              ref={photosUploadRef}
              variant="photos"
              name="images[]"
              maxFiles={10}
              onBeforeSelect={onPhotosBeforeSelect}
              onMount={onPhotosUploadReady}
            />
          </div>
          <div className="w-full grid gap-2">
            <h4 className={LABEL_CLASS}>Jewel Description *</h4>
            <InputTextarea
              placeholder="Enter Jewel Description"
              rows={5}
              cols={30}
              className={INPUT_CLASS}
              value={state.jewelDescription}
              onChange={(e) => update({ jewelDescription: e.target.value })}
            />
          </div>
          <div className="w-full grid gap-2">
            <h4 className={LABEL_CLASS}>Jewel Details *</h4>
            <div className="grid grid-cols-1 gap-3">
              {state.jewelSpecs.map((spec) => (
                <div
                  key={spec.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, spec.id)}
                  onDragOver={(e) => onDragOver(e, spec.id)}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, spec.id)}
                  onDragEnd={onDragEnd}
                  className={`grid grid-cols-1 lg:flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                    dragOverId === spec.id ? 'bg-[#f2debe]/30' : ''
                  } ${draggedId === spec.id ? 'opacity-50' : ''}`}
                >
                  <div
                    className="flex items-center gap-1 shrink-0 cursor-grab active:cursor-grabbing text-[#555555] dark:text-gray-400"
                    title="Drag to reorder"
                  >
                    <span
                      className="material-symbols-rounded flex items-center justify-start"
                      style={{ fontSize: '20px' }}
                    >
                      drag_handle
                    </span>
                  </div>
                  <div className="w-full grid gap-2 flex-1">
                    <label className="text-xs text-secondary-900 dark:text-white">Name *</label>
                    <InputText
                      placeholder="e.g. Brand, Metal, Size"
                      value={spec.name}
                      onChange={(e) => updateSpec(spec.id, 'name', e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="w-full grid gap-2 flex-1">
                    <label className="text-xs text-secondary-900 dark:text-white">Value *</label>
                    <InputText
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) => updateSpec(spec.id, 'value', e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <Button
                    type="button"
                    severity="danger"
                    text
                    rounded
                    disabled={state.jewelSpecs.length <= 1}
                    className="shrink-0 !p-0 !h-8"
                    onClick={() => removeSpec(spec.id)}
                    aria-label="Remove"
                  >
                    <span
                      className="material-symbols-rounded flex items-center justify-start"
                      style={{ fontSize: '20px' }}
                    >
                      do_not_disturb_on
                    </span>
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  text
                  className="shadow-none focus:border-[#704F01]"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#f2f2f2',
                    color: '#704f01',
                  }}
                  onClick={addSpec}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>
                    add
                  </span>
                  <span className="text-sm">Add detail</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full grid gap-2">
            <h4 className={LABEL_CLASS}>Collections *</h4>
            <Dropdown
              options={COLLECTION_OPTIONS}
              optionLabel="label"
              optionValue="value"
              placeholder="Select Collection"
              value={state.collection}
              onChange={(e) => update({ collection: e.value })}
              style={{ width: '50%' }}
              pt={{ root: { className: INPUT_CLASS } }}
            />
          </div>
          <div className="w-full grid gap-2">
            <h4 className={`${LABEL_CLASS} mb-2`}>Certifications (if any)</h4>
            <FileUpload
              ref={certificationsUploadRef}
              variant="certifications"
              name="certifications[]"
              maxFiles={10}
              onBeforeSelect={onCertificationsBeforeSelect}
              disabled={true}
            />
          </div>
        </div>
      </section>

      <hr className={SECTION_HR_CLASS} />

      <section>
        <h1 className={SECTION_TITLE_CLASS}>3. Publishing</h1>
        <div className="grid grid-cols-1 w-1/2 gap-4">
          <div className="w-full grid gap-2">
            <h4 className={LABEL_CLASS}>Published on *</h4>
            <Calendar
              value={state.publishedOn}
              onChange={(e) => update({ publishedOn: e.value ?? null })}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
