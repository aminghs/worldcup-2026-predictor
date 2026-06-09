import { Modal } from './Modal';

interface ResetDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetDialog({ open, onClose, onConfirm }: ResetDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title="Reset bracket?">
      <p className="text-sm text-slate-300">
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
          className="btn bg-red-500/90 text-white hover:bg-red-500"
        >
          Reset everything
        </button>
      </div>
    </Modal>
  );
}
