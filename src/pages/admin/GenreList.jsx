import { useCallback, useEffect, useMemo, useState } from 'react'
import { getErrorMessage } from '../../api/client'
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
import {
  Pencil,
  Plus,
  Refresh,
  Tag,
  Trash,
} from '../../components/ui/icons'
import { useToast } from '../../context/ToastContext'
import {
  createGenre,
  deleteGenre,
  getGenres,
  updateGenre,
} from '../../services/genreService'
import { formatDate } from '../../utils/format'
import { validateGenre } from '../../utils/validation'

const INITIAL_FORM = { name: '', description: '' }

export default function GenreList() {
  const toast = useToast()

  const [genres, setGenres] = useState([])
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

  const loadGenres = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await getGenres()
      setGenres(data)
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Gagal memuat data genre.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGenres()
  }, [loadGenres])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return genres
    return genres.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        (item.description ?? '').toLowerCase().includes(keyword),
    )
  }, [genres, search])

  const openCreate = () => {
    setEditing(null)
    setForm(INITIAL_FORM)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEdit = (genre) => {
    setEditing(genre)
    setForm({ name: genre.name, description: genre.description ?? '' })
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

    const validation = validateGenre(form)
    if (Object.keys(validation).length > 0) {
      setFormErrors(validation)
      return
    }

    setSaving(true)
    try {
      const payload = { name: form.name.trim(), description: form.description.trim() }

      if (editing) {
        await updateGenre(editing.id, payload)
        toast.success(`Genre "${payload.name}" berhasil diperbarui.`)
      } else {
        await createGenre(payload)
        toast.success(`Genre "${payload.name}" berhasil ditambahkan.`)
      }

      setModalOpen(false)
      setEditing(null)
      setForm(INITIAL_FORM)
      await loadGenres()
    } catch (error) {
      const message = getErrorMessage(error, 'Gagal menyimpan data genre.')
      // Tampilkan juga di dalam form bila berkaitan dengan nama.
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
      await deleteGenre(deleteTarget.id)
      toast.success(`Genre "${deleteTarget.name}" berhasil dihapus.`)
      setDeleteTarget(null)
      await loadGenres()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Gagal menghapus data genre.'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Tag}
        eyebrow="Katalog"
        title="Data Genre"
        description="Kelola kategori buku yang digunakan pada katalog BookSales."
        actions={
          <>
            <Button variant="secondary" icon={Refresh} onClick={loadGenres} disabled={loading}>
              Muat ulang
            </Button>
            <Button icon={Plus} onClick={openCreate}>
              Tambah Genre
            </Button>
          </>
        }
      />

      {loadError && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span>{loadError}</span>
          <Button variant="secondary" size="sm" onClick={loadGenres}>
            Coba lagi
          </Button>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-[15px] font-bold text-slate-900">Daftar Genre</h2>
            <Badge tone="brand">{genres.length} data</Badge>
          </div>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari genre…"
            className="sm:w-72"
          />
        </div>

        {/* Tabel (layar >= sm) */}
        <div className="hidden overflow-x-auto scrollbar-thin sm:block">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th scope="col" className="w-14 px-5 py-3">No</th>
                <th scope="col" className="px-5 py-3">Nama Genre</th>
                <th scope="col" className="px-5 py-3">Deskripsi</th>
                <th scope="col" className="w-40 px-5 py-3">Dibuat</th>
                <th scope="col" className="w-28 px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} columns={5} />
              ) : (
                filtered.map((genre, index) => (
                  <tr
                    key={genre.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                          <Tag className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-slate-800">{genre.name}</span>
                      </div>
                    </td>
                    <td className="max-w-[340px] px-5 py-4 text-sm text-slate-500">
                      <p className="line-clamp-2">
                        {genre.description || <span className="italic text-slate-400">Belum ada deskripsi</span>}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{formatDate(genre.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(genre)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
                          title={`Ubah ${genre.name}`}
                          aria-label={`Ubah ${genre.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(genre)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                          title={`Hapus ${genre.name}`}
                          aria-label={`Hapus ${genre.name}`}
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

        {/* Kartu (mobile) */}
        <ul className="divide-y divide-slate-100 sm:hidden">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="space-y-2 p-4">
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200/70" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              </li>
            ))
          ) : (
            filtered.map((genre) => (
              <li key={genre.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <Tag className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{genre.name}</p>
                      <p className="text-[11px] text-slate-400">{formatDate(genre.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => openEdit(genre)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-brand-50 hover:text-brand-600"
                      aria-label={`Ubah ${genre.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(genre)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Hapus ${genre.name}`}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {genre.description || <span className="italic text-slate-400">Belum ada deskripsi</span>}
                </p>
              </li>
            ))
          )}
        </ul>

        {!loading && filtered.length === 0 && (
          <EmptyState
            icon={Tag}
            title={search ? 'Genre tidak ditemukan' : 'Belum ada data genre'}
            description={
              search
                ? `Tidak ada genre yang cocok dengan kata kunci "${search}". Coba kata kunci lain.`
                : 'Tambahkan genre pertama agar buku dapat dikelompokkan dengan rapi.'
            }
            action={
              search ? (
                <Button variant="secondary" onClick={() => setSearch('')}>
                  Hapus pencarian
                </Button>
              ) : (
                <Button icon={Plus} onClick={openCreate}>
                  Tambah Genre
                </Button>
              )
            }
          />
        )}

        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            <span>
              Menampilkan {filtered.length} dari {genres.length} genre
            </span>
            <span className="hidden sm:inline">Klik ikon pensil untuk mengubah data</span>
          </div>
        )}
      </div>

      {/* Modal tambah / ubah */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Ubah Genre' : 'Tambah Genre'}
        description={
          editing
            ? 'Perbarui nama atau deskripsi genre yang dipilih.'
            : 'Lengkapi data genre baru untuk katalog BookSales.'
        }
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" form="genre-form" loading={saving}>
              {editing ? 'Simpan perubahan' : 'Simpan genre'}
            </Button>
          </>
        }
      >
        <form id="genre-form" onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="Nama genre"
            name="name"
            placeholder="Contoh: Fiksi Ilmiah"
            value={form.name}
            onChange={handleChange}
            error={formErrors.name}
            hint="Gunakan nama yang singkat dan mudah dikenali."
            maxLength={40}
            autoFocus
            required
          />

          <Textarea
            label="Deskripsi"
            name="description"
            rows={4}
            placeholder="Jelaskan secara singkat ciri khas genre ini…"
            value={form.description}
            onChange={handleChange}
            error={formErrors.description}
            hint={`${form.description.length}/255 karakter`}
            maxLength={255}
          />
        </form>
      </Modal>

      {/* Konfirmasi hapus */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus genre ini?"
        description={
          <>
            Genre <span className="font-semibold text-slate-800">{deleteTarget?.name}</span> akan
            dihapus permanen. Buku yang memakai genre ini sebaiknya dipindahkan terlebih dahulu.
          </>
        }
      />
    </div>
  )
}
