import { forwardRef, useCallback, useEffect, useMemo } from 'react';
import { FileUpload as PrimeFileUpload, type FileUpload as PrimeFileUploadRef } from 'primereact/fileupload';
import type { FileUploadProps, FileUploadVariant } from './types';

const EMPTY_TEMPLATE_CLASS =
  'flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-[#CCCCCC] rounded-lg bg-[#faf8f5] dark:bg-[#2a2a2a]';
const ITEM_BASE_CLASS =
  'flex items-center gap-3 p-3 rounded-lg border border-[#e5e5e5] dark:border-gray-600 bg-white dark:bg-[#1e1e1e]';

const BUTTON_CLASSES = {
  choose: '!bg-[#545455] !border-[#545455] !text-white shadow-none',
  upload: '!bg-[#704f01] !border-[#704f01] !text-white shadow-none',
  cancel: '!bg-[#704f01] !border-[#704f01] !text-white shadow-none',
} as const;

const DEFAULT_MAX_FILE_SIZE = 10_000_000; // 10 MB

const VARIANT_CONFIG: Record<FileUploadVariant, { accept: string; hint: string }> = {
  photos: {
    accept: 'image/jpeg, image/png, image/jpg, image/webp',
    hint: '10 MB max | JPG, JPEG, PNG or WebP',
  },
  certifications: {
    accept:
      'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    hint: '10 MB max | PDF, DOC or DOCX',
  },
};

/** Options passed by PrimeReact FileUpload to itemTemplate (subset) */
interface ItemTemplateOptions {
  formatSize: string;
  onRemove: (event: React.SyntheticEvent) => void;
  removeElement: React.ReactElement;
}

function createEmptyTemplate(emptyText: string) {
  return (
    <div className={EMPTY_TEMPLATE_CLASS}>
      <p className="m-0 text-sm text-[#555555] dark:text-gray-400">{emptyText}</p>
    </div>
  );
}

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

export const FileUpload = forwardRef<PrimeFileUploadRef, FileUploadProps>(
  (
    {
      variant,
      accept: acceptProp,
      hint: hintProp,
      maxFiles = 10,
      maxFileSize = DEFAULT_MAX_FILE_SIZE,
      onBeforeSelect,
      onClear,
      uploadHandler,
      wrapperClassName = 'grid gap-2 w-3/4',
      emptyText = 'or drop to upload',
      onMount,
      ...rest
    },
    ref
  ) => {
    useEffect(() => {
      onMount?.();
    }, [onMount]);

    const isPreset = variant === 'photos' || variant === 'certifications';
    const config = useMemo(
      () => (isPreset ? VARIANT_CONFIG[variant] : { accept: acceptProp ?? '', hint: hintProp ?? '' }),
      [isPreset, variant, acceptProp, hintProp]
    );

    const accept = isPreset ? config.accept : (acceptProp ?? '');
    const hint = isPreset
      ? config.hint.replace('10 MB', `${maxFileSize / 1_000_000} MB`)
      : (hintProp ?? '');

    const itemTemplate = useMemo(
      () =>
        variant === 'photos'
          ? (file: { name?: string; size?: number; objectURL?: string }, options: ItemTemplateOptions) =>
              photosItemTemplate(file, options)
          : (file: { name?: string; size?: number }, options: ItemTemplateOptions) =>
              certificationsItemTemplate(file, options),
      [variant]
    );

    const emptyTemplate = useMemo(() => createEmptyTemplate(emptyText), [emptyText]);

    const handleBeforeSelect = useCallback(
      (event: { files: File[] }) => {
        if (onBeforeSelect) return onBeforeSelect(event);
        return true;
      },
      [onBeforeSelect]
    );

    return (
      <div className={wrapperClassName}>
        <PrimeFileUpload
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
          chooseOptions={{ label: 'Choose', icon: 'add', className: BUTTON_CLASSES.choose }}
          uploadOptions={{
            label: 'Upload',
            icon: 'upload',
            className: BUTTON_CLASSES.upload,
            style: { display: 'none' as const },
          }}
          cancelOptions={{ label: 'Clear All', icon: 'close', className: BUTTON_CLASSES.cancel }}
          invalidFileSizeMessageDetail={`Maximum upload size is ${maxFileSize / 1_000_000} MB.`}
          className="w-full"
          {...rest}
        />
        {hint && (
          <p className="text-xs text-[#555555] dark:text-gray-400 m-0 flex items-center justify-center">{hint}</p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
