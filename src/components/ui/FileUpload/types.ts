import type { FileUploadProps as PrimeFileUploadProps } from 'primereact/fileupload';

/** Preset variants with built-in accept types, hints, and item templates */
export type FileUploadVariant = 'photos' | 'certifications';

/** Extended variant for custom accept/hint when preset variants are not enough */
export type FileUploadVariantExtended = FileUploadVariant | 'custom';

export interface FileUploadPresetConfig {
  accept: string;
  hint: string;
  maxFileSize?: number;
}

export interface FileUploadProps
  extends Omit<
    PrimeFileUploadProps,
    'emptyTemplate' | 'itemTemplate' | 'chooseOptions' | 'uploadOptions' | 'cancelOptions' | 'maxFileSize'
  > {
  /** Preset variant (photos, certifications) or 'custom' with accept/hint required */
  variant: FileUploadVariantExtended;
  /** Required when variant='custom' */
  accept?: string;
  /** Required when variant='custom' */
  hint?: string;
  maxFiles?: number;
  maxFileSize?: number;
  onBeforeSelect?: (event: { files: File[] }) => boolean;
  onClear?: () => void;
  /** Wrapper div class (e.g. for width). Default: 'grid gap-2 w-3/4' */
  wrapperClassName?: string;
  /** Override empty template text. Default: 'or drop to upload' */
  emptyText?: string;
  /** Called once when the component has mounted (ref is set). Use to set initial uploaded files. */
  onMount?: () => void;
}
