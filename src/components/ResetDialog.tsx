import { Modal } from './Modal';

interface ResetDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetDialog({ open, onClose, onConfirm }: ResetDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title="Reset bracket?">
      <p className="text-sm text-slate-600">
        This clears every group ranking, third-place pick and knockout result. This
        can’t be undone.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="btn-ghost">
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="btn bg-pos4 text-white hover:opacity-90"
        >
          Reset everything
        </button>
      </div>
    </Modal>
  );
}
