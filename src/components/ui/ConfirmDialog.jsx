import { AlertCircle, Trash } from './icons'
import Button from './Button'
import Modal from './Modal'

/**
 * Dialog konfirmasi untuk aksi yang berisiko (contoh: hapus data).
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = 'Hapus data ini?',
  description,
  confirmLabel = 'Ya, hapus',
  cancelLabel = 'Batal',
  tone = 'danger',
}) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={tone} onClick={onConfirm} loading={loading} icon={Trash}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600">
          <AlertCircle className="h-5 w-5" />
        </span>
        <div className="pt-0.5 text-sm leading-relaxed text-slate-600">
          {description ?? 'Data yang sudah dihapus tidak dapat dikembalikan.'}
        </div>
      </div>
    </Modal>
  )
}
