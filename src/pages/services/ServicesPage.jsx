// src/pages/services/ServicesPage.jsx
import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, Filter, ChevronRight, Star, X } from 'lucide-react'
import { projectApi } from '@/services/api'
import { useDebounce } from '@/hooks'
import { formatCurrency, truncate } from '@/utils'
import { CardSkeleton } from '@/components/ui/Skeleton'
import Pagination from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/Pagination'

const PRICE_TYPES = ['All', 'free', 'fixed', 'hourly', 'monthly', 'custom']
const SORTS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt',  label: 'Oldest first' },
  { value: '-viewCount', label: 'Most popular' },
  { value: 'pricing.amount', label: 'Price: Low to High' },
  { value: '-pricing.amount', label: 'Price: High to Low' },
]

export default function ServicesPage() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('search') || '')
  const dSearch = useDebounce(search, 400)
  const page = parseInt(params.get('page') || '1', 10)
  const category = params.get('category') || ''
  const sort = params.get('sort') || '-createdAt'
  const priceType = params.get('priceType') || 'All'

  const updateParam = (key, val) => {
    const next = new URLSearchParams(params)
    val ? next.set(key, val) : next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next)
  }

  const queryParams = useMemo(() => ({
    page, limit: 9, sort,
    ...(dSearch && { search: dSearch }),
    ...(category && { category }),
    ...(priceType !== 'All' && { 'pricing.type': priceType }),
  }), [page, sort, dSearch, category, priceType])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['projects', queryParams],
    queryFn: () => projectApi.list(queryParams),
    placeholderData: (prev) => prev,
  })

  const { data: catData } = useQuery({
    queryKey: ['project-categories'],
    queryFn: () => projectApi.categories(),
    staleTime: Infinity,
  })

  const services = data?.data?.data || []
  const meta = data?.data?.meta
  const categories = catData?.data?.data || []
  const hasFilters = category || priceType !== 'All' || dSearch

  return (
    <div className="pt-24 pb-20 bg-surface-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 py-10">
        <div className="container-page">
          <h1 className="section-title mb-2">Our Services</h1>
          <p className="section-subtitle text-base">Find the perfect service for your business needs</p>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar Filters ── */}
          <aside className="lg:w-60 shrink-0 space-y-6">
            {/* Search */}
            <div className="card card-body p-4">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); updateParam('search', e.target.value) }}
                  placeholder="Search services…"
                  className="form-input pl-9 text-sm"
                />
                {search && (
                  <button onClick={() => { setSearch(''); updateParam('search', '') }} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="card card-body p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-surface-400 mb-3">Category</p>
                <div className="space-y-1">
                  <button
                    onClick={() => updateParam('category', '')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${!category ? 'bg-primary-50 text-primary-700 font-medium' : 'text-surface-600 hover:bg-surface-100'}`}
                  >All categories</button>
                  {categories.map(({ _id, count }) => (
                    <button key={_id} onClick={() => updateParam('category', _id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between transition-colors ${category === _id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-surface-600 hover:bg-surface-100'}`}
                    >
                      <span>{_id}</span>
                      <span className="text-xs badge-gray">{count}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price type */}
            <div className="card card-body p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-surface-400 mb-3">Pricing type</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_TYPES.map((t) => (
                  <button key={t} onClick={() => updateParam('priceType', t === 'All' ? '' : t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${(t === 'All' && priceType === 'All') || priceType === t ? 'bg-primary-700 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}
                  >{t}</button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button onClick={() => { setSearch(''); setParams(new URLSearchParams()) }} className="btn-ghost btn-sm w-full">
                <X size={14} /> Clear all filters
              </button>
            )}
          </aside>

          {/* ── Main Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <p className="text-sm text-surface-500">
                {isLoading ? '…' : `${meta?.total ?? services.length} services found`}
                {isFetching && !isLoading && <span className="ml-2 text-primary-600 animate-pulse">Updating…</span>}
              </p>
              <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="form-input w-auto text-sm py-2">
                {SORTS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>

            {/* Grid */}
            <div className={`grid sm:grid-cols-2 xl:grid-cols-3 gap-5 transition-opacity ${isFetching && !isLoading ? 'opacity-60' : 'opacity-100'}`}>
              {isLoading
                ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
                : services.length > 0
                  ? services.map((s) => (
                      <motion.div key={s._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-hover group flex flex-col">
                        <div className="relative h-40 bg-gradient-to-br from-primary-50 to-primary-100 rounded-t-2xl overflow-hidden">
                          {s.images?.[0]?.url ? (
                            <img src={s.images[0].url} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">💼</div>
                          )}
                          {s.isFeatured && (
                            <span className="absolute top-2 left-2 badge bg-accent-400 text-accent-900 text-[10px]">
                              <Star size={9} fill="currentColor" /> Featured
                            </span>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <span className="badge-primary text-[10px] mb-2 self-start">{s.category}</span>
                          <h3 className="font-semibold text-surface-900 text-sm leading-snug mb-1 group-hover:text-primary-700 transition-colors">{s.title}</h3>
                          <p className="text-xs text-surface-500 flex-1 leading-relaxed">{truncate(s.shortDescription || s.description, 80)}</p>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
                            <p className="text-sm font-semibold text-surface-900">
                              {s.pricing?.type === 'free' ? 'Free' : formatCurrency(s.pricing?.amount, s.pricing?.currency)}
                            </p>
                            <Link to={`/services/${s.slug || s._id}`} className="btn-outline btn-sm">
                              Details <ChevronRight size={13} />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  : <div className="col-span-3"><EmptyState icon={Search} title="No services found" description="Try adjusting your search or filters." /></div>
              }
            </div>

            {meta && meta.totalPages > 1 && (
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                onPageChange={(p) => updateParam('page', p)}
                className="mt-10"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
