import { useCallback, useEffect, useMemo, useState } from 'react'
import { getErrorMessage } from '../../api/client'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import SearchInput from '../../components/ui/SearchInput'
import { TableSkeleton } from '../../components/ui/Skeleton'
import Textarea from '../../components/ui/Textarea'
import { Pencil, Plus, Refresh, Trash, UserPen } from '../../components/ui/icons'
import { useToast } from '../../context/ToastContext'
import {
  createAuthor,
  deleteAuthor,
  getAuthors,
  updateAuthor,
} from '../../services/authorService'
import { formatDate } from '../../utils/format'
import { validateAuthor } from '../../utils/validation'

const INITIAL_FORM = { name: '', nationality: '', bio: '' }

export default function AuthorList() {
  const toast = useToast()

  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadAuthors = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await getAuthors()
      setAuthors(data)
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Gagal memuat data author.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAuthors()
  }, [loadAuthors])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return authors
    return authors.filter((item) =>
      [item.name, item.nationality, item.bio]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(keyword)),
    )
  }, [authors, search])

  const openCreate = () => {
    setEditing(null)
    setForm(INITIAL_FORM)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEdit = (author) => {
    setEditing(author)
    setForm({
      name: author.name,
      nationality: author.nationality ?? '',
      bio: author.bio ?? '',
    })
    setFormErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
    setEditing(null)
    setFormErrors({})
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validation = validateAuthor(form)
    if (Object.keys(validation).length > 0) {
      setFormErrors(validation)
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        nationality: form.nationality.trim(),
        bio: form.bio.trim(),
      }

      if (editing) {
        await updateAuthor(editing.id, payload)
        toast.success(`Data author "${payload.name}" berhasil diperbarui.`)
      } else {
        await createAuthor(payload)
        toast.success(`Author "${payload.name}" berhasil ditambahkan.`)
      }

      setModalOpen(false)
      setEditing(null)
      setForm(INITIAL_FORM)
      await loadAuthors()
    } catch (error) {
      const message = getErrorMessage(error, 'Gagal menyimpan data author.')
      if (message.toLowerCase().includes('nama') || message.toLowerCase().includes('terdaftar')) {
        setFormErrors({ name: message })
      }
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAuthor(deleteTarget.id)
      toast.success(`Author "${deleteTarget.name}" berhasil dihapus.`)
      setDeleteTarget(null)
      await loadAuthors()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal menghapus data author.'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UserPen}
        eyebrow="Katalog"
        title="Data Author"
        description="Simpan dan rawat data penulis beserta keterangan singkatnya."
        actions={
          <>
            <Button variant="secondary" icon={Refresh} onClick={loadAuthors} disabled={loading}>
              Muat ulang
            </Button>
            <Button icon={Plus} onClick={openCreate}>
              Tambah Author
            </Button>
          </>
        }
      />

      {loadError && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span>{loadError}</span>
          <Button variant="secondary" size="sm" onClick={loadAuthors}>
            Coba lagi
          </Button>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-[15px] font-bold text-slate-900">Daftar Author</h2>
            <Badge tone="brand">{authors.length} data</Badge>
          </div>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari author…"
            className="sm:w-72"
          />
        </div>

        {/* Tabel desktop */}
        <div className="hidden overflow-x-auto scrollbar-thin sm:block">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th scope="col" className="w-14 px-5 py-3">No</th>
                <th scope="col" className="px-5 py-3">Author</th>
                <th scope="col" className="px-5 py-3">Bio</th>
                <th scope="col" className="w-40 px-5 py-3">Ditambahkan</th>
                <th scope="col" className="w-28 px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} columns={5} />
              ) : (
                filtered.map((author, index) => (
                  <tr
                    key={author.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={author.name} size="sm" className="ring-0" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {author.name}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {author.nationality || 'Kebangsaan belum diisi'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[320px] px-5 py-4 text-sm text-slate-500">
                      <p className="line-clamp-2">
                        {author.bio || <span className="italic text-slate-400">Belum ada bio</span>}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{formatDate(author.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(author)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
                          title={`Ubah ${author.name}`}
                          aria-label={`Ubah ${author.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(author)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                          title={`Hapus ${author.name}`}
                          aria-label={`Hapus ${author.name}`}
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Kartu mobile */}
        <ul className="divide-y divide-slate-100 sm:hidden">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="flex items-center gap-3 p-4">
                <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200/70" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/2 animate-pulse rounded bg-slate-200/70" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                </div>
              </li>
            ))
          ) : (
            filtered.map((author) => (
              <li key={author.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={author.name} size="sm" className="ring-0" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{author.name}</p>
                      <p className="truncate text-[11px] text-slate-400">
                        {author.nationality || 'Kebangsaan belum diisi'}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(author)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-brand-50 hover:text-brand-600"
                      aria-label={`Ubah ${author.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(author)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Hapus ${author.name}`}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {author.bio || <span className="italic text-slate-400">Belum ada bio</span>}
                </p>
              </li>
            ))
          )}
        </ul>

        {!loading && filtered.length === 0 && (
          <EmptyState
            icon={UserPen}
            title={search ? 'Author tidak ditemukan' : 'Belum ada data author'}
            description={
              search
                ? `Tidak ada author yang cocok dengan kata kunci "${search}".`
                : 'Tambahkan author pertama agar setiap buku memiliki penulis yang jelas.'
            }
            action={
              search ? (
                <Button variant="secondary" onClick={() => setSearch('')}>
                  Hapus pencarian
                </Button>
              ) : (
                <Button icon={Plus} onClick={openCreate}>
                  Tambah Author
                </Button>
              )
            }
          />
        )}

        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            <span>
              Menampilkan {filtered.length} dari {authors.length} author
            </span>
            <span className="hidden sm:inline">Data author dipakai pada form buku</span>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Ubah Author' : 'Tambah Author'}
        description={
          editing
            ? 'Perbarui identitas penulis yang dipilih.'
            : 'Masukkan identitas penulis yang akan dipakai pada katalog buku.'
        }
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" form="author-form" loading={saving}>
              {editing ? 'Simpan perubahan' : 'Simpan author'}
            </Button>
          </>
        }
      >
        <form id="author-form" onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="Nama lengkap author"
            name="name"
            placeholder="Contoh: Andrea Hirata"
            value={form.name}
            onChange={handleChange}
            error={formErrors.name}
            maxLength={60}
            autoFocus
            required
          />

          <Input
            label="Kebangsaan"
            name="nationality"
            placeholder="Contoh: Indonesia"
            value={form.nationality}
            onChange={handleChange}
            error={formErrors.nationality}
            hint="Opsional, membantu pembaca mengenali asal penulis."
            maxLength={40}
          />

          <Textarea
            label="Bio singkat"
            name="bio"
            rows={4}
            placeholder="Tuliskan pencapaian atau ciri khas karya penulis…"
            value={form.bio}
            onChange={handleChange}
            error={formErrors.bio}
            hint={`${form.bio.length}/255 karakter`}
            maxLength={255}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus author ini?"
        description={
          <>
            Author <span className="font-semibold text-slate-800">{deleteTarget?.name}</span> akan
            dihapus permanen dari katalog.
          </>
        }
      />
    </div>
  )
}
