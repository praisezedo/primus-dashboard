"use client";

interface DeleteStudentModalProps {
  open: boolean;
  studentName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteStudentModal({
  open,
  studentName,
  onClose,
  onConfirm,
}: DeleteStudentModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-100 space-y-4">
        <h2 className="text-lg font-bold">Delete Student</h2>

        <p className="text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{studentName}</span>?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 hover:opacity-50 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="hover:opacity-50 px-4 py-2 rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
