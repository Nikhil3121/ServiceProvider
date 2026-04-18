// src/pages/admin/AdminServices.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Plus, Search, Edit, Trash2, Eye, EyeOff, Star, X, Briefcase
} from 'lucide-react'
import toast from 'react-hot-toast'
import { projectApi } from '@/services/api'
import { useDebounce } from '@/hooks'
import { formatCurrency, formatDate, getErrorMessage, truncate } from '@/utils'
import { CardSkeleton } from '@/components/ui/Skeleton'
import Pagination from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/Pagination'

export default function AdminServices() {
  const qc = useQueryClient()
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [category, setCategory] = useState('')
  const dSearch = useDebounce(search, 400)

  const queryParams = { page, limit: 9, sort: '-createdAt', ...(dSearch && { search: dSearch }), ...(category && { category }) }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-projects', queryParams],
    queryFn: () => projectApi.list({ ...queryParams, includeDeleted: false }),
    placeholderData: (prev) => prev,
  })

  const { data: catData } = useQuery({
    queryKey: ['project-categories'],
    queryFn: () => projectApi.categories(),
    staleTime: Infinity,
  })

  const services   = data?.data?.data || []
  const meta       = data?.data?.meta
  const categories = catData?.data?.data || []

  const { mutate: deleteService, isPending: deleting } = useMutation({
    mutationFn: (id) => projectApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-projects'] })
      qc.invalidateQueries({ queryKey: ['project-categories'] })
      toast.success('Service deleted')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const { mutate: toggleActive } = useMutation({
    mutationFn: ({ id, isActive }) => projectApi.update(id, { isActive }),
    onSuccess: (_, { isActive }) => {
      qc.invalidateQueries({ queryKey: ['admin-projects'] })
      toast.success(isActive ? 'Service activated' : 'Service deactivated')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const handleDelete = (s) => {
    if (window.confirm(`Delete "${s.title}"? This cannot be undone.`)) deleteService(s._id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-surface-900">Services</h1>
          <p className="text-surface-500 text-sm mt-1">{meta?.total ?? '…'} services listed</p>
        </div>
        <Link to="/admin/services/new" className="btn-primary">
          <Plus size={16} /> Add service
        </Link>
      </div>

      {/* Filters */}
      <div className="card card-body p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search services…" className="form-input pl-9 text-sm w-full" />
            {search && <button onClick={() => { setSearch(''); setPage(1) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400"><X size={14} /></button>}
          </div>
          {categories.length > 0 && (
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1) }} className="form-input text-sm py-2 w-auto">
              <option value="">All categories</option>
              {categories.map(({ _id }) => <option key={_id} value={_id}>{_id}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className={`grid sm:grid-cols-2 xl:grid-cols-3 gap-5 transition-opacity ${isFetching && !isLoading ? 'opacity-60' : ''}`}>
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
        ) : services.length === 0 ? (
          <div className="col-span-3">
            <EmptyState
              icon={Briefcase}
              title="No services yet"
              description="Create your first service to get started."
              action={<Link to="/admin/services/new" className="btn-primary">Add service</Link>}
            />
          </div>
        ) : (
          services.map((s) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card group flex flex-col transition-all duration-200 ${!s.isActive ? 'opacity-60' : ''}`}
            >
              {/* Thumbnail */}
              <div className="relative h-40 bg-gradient-to-br from-primary-50 to-primary-100 rounded-t-2xl overflow-hidden">
                {s.images?.[0]?.url ? (
                  <img src={s.images[0].url} alt={s.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">💼</div>
                )}
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1.5">
                  {s.isFeatured && <span className="badge bg-accent-400 text-accent-900 text-[10px]"><Star size={8} fill="currentColor" /> Featured</span>}
                  {!s.isActive && <span className="badge bg-surface-800/80 text-white text-[10px]">Draft</span>}
                </div>
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link to={`/services/${s.slug || s._id}`} target="_blank" className="p-2 bg-white/90 rounded-xl hover:bg-white transition-colors" title="View public page">
                    <Eye size={15} className="text-surface-700" />
                  </Link>
                  <Link to={`/admin/services/${s._id}/edit`} className="p-2 bg-white/90 rounded-xl hover:bg-white transition-colors" title="Edit">
                    <Edit size={15} className="text-surface-700" />
                  </Link>
                  <button
                    onClick={() => toggleActive({ id: s._id, isActive: !s.isActive })}
                    className="p-2 bg-white/90 rounded-xl hover:bg-white transition-colors"
                    title={s.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {s.isActive ? <EyeOff size={15} className="text-amber-600" /> : <Eye size={15} className="text-green-600" />}
                  </button>
                  <button
                    onClick={() => handleDelete(s)}
                    disabled={deleting}
                    className="p-2 bg-white/90 rounded-xl hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} className="text-red-500" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <span className="badge-primary text-[10px] mb-2 self-start">{s.category}</span>
                <h3 className="font-semibold text-surface-900 text-sm leading-snug mb-1">{s.title}</h3>
                <p className="text-xs text-surface-400 flex-1">{truncate(s.shortDescription || s.description, 70)}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100">
                  <p className="text-sm font-semibold text-surface-900">
                    {s.pricing?.type === 'free' ? 'Free' : s.pricing?.type === 'custom' ? 'Custom' : formatCurrency(s.pricing?.amount, s.pricing?.currency)}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-surface-400">{s.viewCount || 0} views</span>
                    <Link to={`/admin/services/${s._id}/edit`} className="btn-secondary btn-sm">
                      <Edit size={12} /> Edit
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={(p) => { setPage(p); window.scrollTo(0, 0) }} className="mt-8" />
      )}
    </div>
  )
}
