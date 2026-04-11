"use client";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 text-gray-500 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-full"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm hover:opacity-80"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm text-white disabled:opacity-50 hover:opacity-90"
          >
            {loading ? "Sending..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
