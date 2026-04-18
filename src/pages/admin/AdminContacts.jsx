// src/pages/admin/AdminContacts.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Search, Mail, Phone, Trash2, Eye, MessageSquare, X,
  CheckCircle, Clock, XCircle, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '@/services/api'
import { useDebounce } from '@/hooks'
import { formatDate, getErrorMessage, truncate } from '@/utils'
import { ListSkeleton } from '@/components/ui/Skeleton'
import Pagination from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/Pagination'
import Modal from '@/components/ui/Modal'

const STATUS_OPTIONS = ['all', 'new', 'read', 'replied', 'closed']

const statusBadge = (s) => ({
  new:     'bg-amber-100 text-amber-700',
  read:    'bg-blue-100 text-blue-700',
  replied: 'bg-green-100 text-green-700',
  closed:  'bg-surface-100 text-surface-500',
}[s] || 'badge-gray')

const statusIcon = (s) => ({
  new:     <Clock size={11} />,
  read:    <Eye size={11} />,
  replied: <CheckCircle size={11} />,
  closed:  <XCircle size={11} />,
}[s])

export default function AdminContacts() {
  const qc = useQueryClient()
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('all')
  const [page, setPage]         = useState(1)
  const [selected, setSelected] = useState(null)
  const dSearch = useDebounce(search, 400)

  const queryParams = {
    page, limit: 10,
    ...(dSearch && { search: dSearch }),
    ...(status !== 'all' && { status }),
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-contacts', queryParams],
    queryFn: () => adminApi.listContacts(queryParams),
    placeholderData: (prev) => prev,
  })

  const contacts = data?.data?.data || []
  const meta     = data?.data?.meta

  const { mutate: updateStatus, isPending: updating } = useMutation({
    mutationFn: ({ id, status, adminNotes }) => adminApi.updateContact(id, { status, adminNotes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-contacts'] })
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
      toast.success('Contact updated')
      setSelected(null)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const { mutate: deleteContact, isPending: deleting } = useMutation({
    mutationFn: (id) => adminApi.deleteContact(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-contacts'] })
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
      toast.success('Contact deleted')
      setSelected(null)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const openDetail = (contact) => {
    setSelected(contact)
    // Mark as read automatically
    if (contact.status === 'new') {
      updateStatus({ id: contact._id, status: 'read' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-surface-900">Messages</h1>
          <p className="text-surface-500 text-sm mt-1">Contact form submissions from visitors</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card card-body p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name, email, or subject…" className="form-input pl-9 text-sm w-full" />
            {search && <button onClick={() => { setSearch(''); setPage(1) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400"><X size={14} /></button>}
          </div>
          <div className="flex gap-1.5">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1) }}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${status === s ? 'bg-primary-700 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}
              >{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className={`space-y-2 transition-opacity ${isFetching && !isLoading ? 'opacity-70' : ''}`}>
        {isLoading ? (
          <ListSkeleton rows={5} />
        ) : contacts.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No messages found" description="No contact form submissions match your filters." />
        ) : (
          contacts.map((c) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card card-body p-4 cursor-pointer hover:border-primary-200 hover:shadow-card-hover transition-all duration-200 ${c.status === 'new' ? 'border-amber-200 bg-amber-50/30' : ''}`}
              onClick={() => openDetail(c)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${c.status === 'new' ? 'bg-amber-100 text-amber-700' : 'bg-surface-100 text-surface-500'}`}>
                  <MessageSquare size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-medium text-surface-900 text-sm">{c.name}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusBadge(c.status)}`}>
                      {statusIcon(c.status)} {c.status}
                    </span>
                    {c.status === 'new' && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
                  </div>
                  <p className="text-xs text-surface-500 mb-1.5">{c.email} {c.phone && `· ${c.phone}`}</p>
                  {c.subject && <p className="text-sm font-medium text-surface-800 mb-1">{c.subject}</p>}
                  <p className="text-sm text-surface-500">{truncate(c.message, 100)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-surface-400">{formatDate(c.createdAt, 'MMM d')}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this message?')) deleteContact(c._id) }}
                    disabled={deleting}
                    className="mt-1 p-1 text-surface-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={(p) => { setPage(p); window.scrollTo(0, 0) }} className="mt-6" />
      )}

      {/* Detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Contact message" size="md">
        {selected && (
          <div className="space-y-4">
            {/* Sender info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface-50 rounded-xl">
                <p className="text-xs text-surface-400 mb-0.5">Name</p>
                <p className="text-sm font-medium text-surface-900">{selected.name}</p>
              </div>
              <div className="p-3 bg-surface-50 rounded-xl">
                <p className="text-xs text-surface-400 mb-0.5">Status</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge(selected.status)}`}>
                  {statusIcon(selected.status)} {selected.status}
                </span>
              </div>
              <div className="p-3 bg-surface-50 rounded-xl">
                <p className="text-xs text-surface-400 mb-0.5">Email</p>
                <a href={`mailto:${selected.email}`} className="text-sm text-primary-600 hover:underline">{selected.email}</a>
              </div>
              {selected.phone && (
                <div className="p-3 bg-surface-50 rounded-xl">
                  <p className="text-xs text-surface-400 mb-0.5">Phone</p>
                  <a href={`tel:${selected.phone}`} className="text-sm text-primary-600 hover:underline">{selected.phone}</a>
                </div>
              )}
            </div>

            {selected.subject && (
              <div>
                <p className="text-xs text-surface-400 mb-1">Subject</p>
                <p className="text-sm font-medium text-surface-900">{selected.subject}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-surface-400 mb-2">Message</p>
              <div className="p-4 bg-surface-50 rounded-xl text-sm text-surface-800 leading-relaxed whitespace-pre-wrap max-h-52 overflow-y-auto">
                {selected.message}
              </div>
            </div>

            {/* Admin notes */}
            <div>
              <label className="form-label">Admin notes (internal)</label>
              <textarea
                id="admin-notes"
                rows={3}
                defaultValue={selected.adminNotes || ''}
                className="form-input resize-none"
                placeholder="Add internal notes…"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-between">
              <div className="flex gap-2">
                <a href={`mailto:${selected.email}`} className="btn-primary btn-sm">
                  <Mail size={13} /> Reply via email
                </a>
                {selected.phone && (
                  <a href={`tel:${selected.phone}`} className="btn-secondary btn-sm">
                    <Phone size={13} /> Call
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  id="contact-status"
                  defaultValue={selected.status}
                  className="form-input text-sm py-1.5 w-auto"
                >
                  {['new', 'read', 'replied', 'closed'].map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <button
                  onClick={() => updateStatus({
                    id: selected._id,
                    status: document.getElementById('contact-status').value,
                    adminNotes: document.getElementById('admin-notes').value,
                  })}
                  disabled={updating}
                  className="btn-secondary btn-sm"
                >
                  <RefreshCw size={13} className={updating ? 'animate-spin' : ''} />
                  {updating ? 'Saving…' : 'Update'}
                </button>
              </div>
            </div>

            <p className="text-xs text-surface-400 text-center">Received {formatDate(selected.createdAt, 'MMM d, yyyy · h:mm a')}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
