'use client';

/**
 * ImageUploadField
 *
 * A reusable image input that supports:
 *  - Drag-and-drop file upload
 *  - Click-to-browse file upload
 *  - URL input as an alternative
 *  - Preview thumbnail(s) with remove button
 *
 * For actual file uploads, `uploadFile` is called with the selected File.
 * It is stubbed below — wire it to your backend when ready.
 */

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// ─── Upload stub ─────────────────────────────────────────────────────────────
// Replace this with a real API call, e.g.:
//   const form = new FormData(); form.append('file', file);
//   const res = await fetch(`${API_URL}/uploads`, { method: 'POST', body: form });
//   return (await res.json()).url as string;
async function uploadFile(_file: File): Promise<string> {
  // TODO: wire to backend upload endpoint
  // For now, create a local object URL as a temporary preview placeholder
  return URL.createObjectURL(_file);
}
// ─────────────────────────────────────────────────────────────────────────────

interface ImageUploadFieldProps {
  /** Current value — a single URL string. For single-image mode. */
  value?: string;
  /** Called when the value changes (single-image mode). */
  onChange?: (url: string) => void;

  /** Current values — array of URL strings. For multi-image mode. */
  values?: string[];
  /** Called when the list changes (multi-image mode). */
  onChangeMultiple?: (urls: string[]) => void;

  /** If true, allows multiple images. */
  multiple?: boolean;
  label?: string;
  hint?: string;
  className?: string;
}

type InputTab = 'upload' | 'url';

export function ImageUploadField({
  value,
  onChange,
  values,
  onChangeMultiple,
  multiple = false,
  label,
  hint,
  className,
}: ImageUploadFieldProps) {
  const [tab, setTab] = useState<InputTab>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUrls: string[] = multiple
    ? (values ?? [])
    : value
    ? [value]
    : [];

  const addUrl = useCallback(
    (url: string) => {
      const trimmed = url.trim();
      if (!trimmed) return;
      if (multiple) {
        onChangeMultiple?.([...(values ?? []), trimmed]);
      } else {
        onChange?.(trimmed);
      }
    },
    [multiple, values, onChangeMultiple, onChange]
  );

  const removeUrl = useCallback(
    (index: number) => {
      if (multiple) {
        onChangeMultiple?.((values ?? []).filter((_, i) => i !== index));
      } else {
        onChange?.('');
      }
    },
    [multiple, values, onChangeMultiple, onChange]
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setIsUploading(true);
      try {
        const uploads = await Promise.all(Array.from(files).map(uploadFile));
        if (multiple) {
          onChangeMultiple?.([...(values ?? []), ...uploads]);
        } else {
          onChange?.(uploads[0]);
        }
      } finally {
        setIsUploading(false);
        // Reset file input so the same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [multiple, values, onChangeMultiple, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleUrlAdd = () => {
    addUrl(urlInput);
    setUrlInput('');
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Label */}
      {label && (
        <div>
          <p className="text-sm font-medium text-gray-700">{label}</p>
          {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={cn(
            'px-3 py-1 text-xs font-medium rounded-md transition-colors',
            tab === 'upload'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Upload file
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={cn(
            'px-3 py-1 text-xs font-medium rounded-md transition-colors',
            tab === 'url'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Paste URL
        </button>
      </div>

      {/* Upload dropzone */}
      {tab === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer transition-colors',
            isDragging
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-200 bg-gray-50 hover:border-teal-400 hover:bg-teal-50/40'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {isUploading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="h-4 w-4 animate-spin text-teal-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
              Uploading…
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100">
                <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Drag &amp; drop or <span className="text-teal-600">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 10 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* URL input */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlAdd())}
            placeholder="https://example.com/image.jpg"
            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <button
            type="button"
            onClick={handleUrlAdd}
            disabled={!urlInput.trim()}
            className="px-4 py-2 text-sm font-medium rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {/* Previews */}
      {currentUrls.length > 0 && (
        <div className={cn(multiple ? 'grid grid-cols-3 sm:grid-cols-4 gap-3' : 'flex')}>
          {currentUrls.map((url, i) => (
            <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Preview ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%239ca3af'%3ENo preview%3C/text%3E%3C/svg%3E";
                }}
              />
              {/* Hover overlay with remove button */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeUrl(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700"
                  aria-label="Remove image"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
