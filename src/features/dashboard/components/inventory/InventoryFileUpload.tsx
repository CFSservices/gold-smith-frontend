import { forwardRef, useCallback } from 'react';
import { FileUpload, type FileUploadProps } from 'primereact/fileupload';
import { FILE_UPLOAD_CLASSES } from '@/config/inventoryStyles';

const EMPTY_TEMPLATE_CLASS =
  'flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-[#CCCCCC] rounded-lg bg-[#faf8f5] dark:bg-[#2a2a2a]';
const ITEM_BASE_CLASS =
  'flex items-center gap-3 p-3 rounded-lg border border-[#e5e5e5] dark:border-gray-600 bg-white dark:bg-[#1e1e1e]';

export type InventoryFileUploadVariant = 'photos' | 'certifications';

const MAX_FILE_SIZE = 10_000_000; // 10 MB

/** Options passed by PrimeReact FileUpload to itemTemplate (subset) */
interface ItemTemplateOptions {
  formatSize: string;
  onRemove: (event: React.SyntheticEvent) => void;
  removeElement: React.ReactElement;
}

export interface InventoryFileUploadProps
  extends Omit<
    FileUploadProps,
    'emptyTemplate' | 'itemTemplate' | 'chooseOptions' | 'uploadOptions' | 'cancelOptions' | 'maxFileSize'
  > {
  variant: InventoryFileUploadVariant;
  maxFiles?: number;
  maxFileSize?: number;
  onBeforeSelect?: (event: { files: File[] }) => boolean;
  onClear?: () => void;
}

const emptyTemplate = (
  <div className={EMPTY_TEMPLATE_CLASS}>
    <p className="m-0 text-sm text-[#555555] dark:text-gray-400">or drop to upload</p>
  </div>
);

function photosItemTemplate(
  file: { name?: string; size?: number; objectURL?: string },
  options: ItemTemplateOptions
) {
  return (
    <div className={ITEM_BASE_CLASS}>
      {file.objectURL && (
        <img src={file.objectURL} alt={file.name} className="w-12 h-12 object-cover rounded shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="m-0 text-sm font-medium truncate">{file.name}</p>
        <p className="m-0 text-xs text-[#555555] dark:text-gray-400">{options.formatSize}</p>
      </div>
      <div className="shrink-0">{options.removeElement}</div>
    </div>
  );
}

function certificationsItemTemplate(
  file: { name?: string; size?: number },
  options: ItemTemplateOptions
) {
  return (
    <div className={ITEM_BASE_CLASS}>
      <div className="w-12 h-12 rounded shrink-0 flex items-center justify-center bg-[#f2f2f2] dark:bg-gray-700">
        <span className="material-symbols-rounded text-[#704f01] dark:text-[#f2debe]" style={{ fontSize: '28px' }}>
          description
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="m-0 text-sm font-medium truncate">{file.name}</p>
        <p className="m-0 text-xs text-[#555555] dark:text-gray-400">{options.formatSize}</p>
      </div>
      <div className="shrink-0">{options.removeElement}</div>
    </div>
  );
}

const chooseOptions = {
  label: 'Choose',
  icon: 'add',
  className: FILE_UPLOAD_CLASSES.choose,
};
const uploadOptions = {
  label: 'Upload',
  icon: 'upload',
  className: FILE_UPLOAD_CLASSES.upload,
  style: { display: 'none' as const },
};
const cancelOptions = {
  label: 'Clear All',
  icon: 'close',
  className: FILE_UPLOAD_CLASSES.cancel,
};

export const InventoryFileUpload = forwardRef<FileUpload, InventoryFileUploadProps>(
  (
    {
      variant,
      maxFiles = 10,
      maxFileSize = MAX_FILE_SIZE,
      onBeforeSelect,
      onClear,
      uploadHandler,
      ...rest
    },
    ref
  ) => {
    const itemTemplate =
      variant === 'photos'
        ? (file: { name?: string; size?: number; objectURL?: string }, options: ItemTemplateOptions) =>
            photosItemTemplate(file, options)
        : (file: { name?: string; size?: number }, options: ItemTemplateOptions) =>
            certificationsItemTemplate(file, options);

    const accept =
      variant === 'photos'
        ? 'image/jpeg, image/png, image/jpg, image/webp'
        : 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const invalidFileSizeMessageDetail = `Maximum upload size is ${maxFileSize / 1_000_000} MB.`;
    const hint =
      variant === 'photos'
        ? '10 MB max | JPG, JPEG, PNG or WebP'
        : `${maxFileSize / 1_000_000} MB max | PDF, DOC or DOCX`;

    const handleBeforeSelect = useCallback(
      (event: { files: File[] }) => {
        if (onBeforeSelect) return onBeforeSelect(event);
        return true;
      },
      [onBeforeSelect]
    );

    return (
      <div className="grid gap-2 w-3/4">
        <FileUpload
          ref={ref}
          multiple
          mode="advanced"
          auto={false}
          accept={accept}
          maxFileSize={maxFileSize}
          customUpload
          uploadHandler={uploadHandler ?? (() => {})}
          onBeforeSelect={handleBeforeSelect}
          onClear={onClear}
          emptyTemplate={emptyTemplate}
          itemTemplate={itemTemplate}
          chooseOptions={chooseOptions}
          uploadOptions={uploadOptions}
          cancelOptions={cancelOptions}
          invalidFileSizeMessageDetail={invalidFileSizeMessageDetail}
          className="w-full"
          {...rest}
        />
        <p className="text-xs text-[#555555] dark:text-gray-400 m-0 flex items-center justify-center">{hint}</p>
      </div>
    );
  }
);

InventoryFileUpload.displayName = 'InventoryFileUpload';
