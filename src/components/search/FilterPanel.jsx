// src/components/search/FilterPanel.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'

const CATEGORIES = ['Plumbing', 'Electrical', 'Cleaning', 'Gardening', 'Painting', 'Moving', 'AC Repair', 'Tech Support', 'Carpentry', 'Security']
const RATINGS = [5, 4, 3]
const PRICE_RANGES = [
  { label: 'Under ₹500', value: '0-500' },
  { label: '₹500 – ₹1,000', value: '500-1000' },
  { label: '₹1,000 – ₹2,500', value: '1000-2500' },
  { label: '₹2,500+', value: '2500-99999' },
]
const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
]

export default function FilterPanel({ onClose, isMobile }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedRating, setSelectedRating] = useState(searchParams.get('rating') || '')
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular')

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedRating) params.set('rating', selectedRating)
    if (selectedPrice) params.set('price', selectedPrice)
    if (sortBy) params.set('sort', sortBy)
    if (searchParams.get('q')) params.set('q', searchParams.get('q'))
    setSearchParams(params)
    onClose?.()
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedRating('')
    setSelectedPrice('')
    setSortBy('popular')
    setSearchParams({})
    onClose?.()
  }

  const activeCount = [selectedCategory, selectedRating, selectedPrice].filter(Boolean).length

  const content = (
    <div className="space-y-5 p-4">
      {/* Sort */}
      <FilterSection title="Sort By">
        <div className="space-y-1.5">
          {SORT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${sortBy === opt.value ? 'border-primary-500 bg-primary-500' : 'border-surface-600 group-hover:border-surface-500'}`}>
                {sortBy === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <input type="radio" name="sort" value={opt.value} checked={sortBy === opt.value} onChange={() => setSortBy(opt.value)} className="sr-only" />
              <span className="text-sm text-surface-300 group-hover:text-white transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedCategory === cat ? 'bg-primary-600 border-primary-600 text-white' : 'bg-surface-800 border-surface-700 text-surface-300 hover:border-surface-600 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Min Rating */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-1.5">
          {RATINGS.map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${selectedRating === String(r) ? 'border-primary-500 bg-primary-500' : 'border-surface-600 group-hover:border-surface-500'}`}>
                {selectedRating === String(r) && <span className="text-white text-[9px]">✓</span>}
              </div>
              <input type="checkbox" checked={selectedRating === String(r)} onChange={() => setSelectedRating(selectedRating === String(r) ? '' : String(r))} className="sr-only" />
              <span className="text-sm text-surface-300 group-hover:text-white flex items-center gap-1">
                {'★'.repeat(r)}<span className="text-surface-500">{'★'.repeat(5 - r)}</span>
                <span className="text-surface-500 ml-1">& above</span>
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-1.5">
          {PRICE_RANGES.map((p) => (
            <label key={p.value} className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${selectedPrice === p.value ? 'border-primary-500 bg-primary-500' : 'border-surface-600 group-hover:border-surface-500'}`}>
                {selectedPrice === p.value && <span className="text-white text-[9px]">✓</span>}
              </div>
              <input type="checkbox" checked={selectedPrice === p.value} onChange={() => setSelectedPrice(selectedPrice === p.value ? '' : p.value)} className="sr-only" />
              <span className="text-sm text-surface-300 group-hover:text-white transition-colors">{p.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button onClick={clearFilters} className="flex-1 py-2.5 rounded-xl border border-surface-700 text-surface-300 hover:bg-surface-800 text-sm transition-colors">
          Clear {activeCount > 0 ? `(${activeCount})` : ''}
        </button>
        <button onClick={applyFilters} className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium text-sm transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  )

  if (!isMobile) {
    return (
      <div className="w-56 flex-shrink-0">
        <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden sticky top-20">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-800">
            <span className="text-sm font-semibold text-white">Filters</span>
            {activeCount > 0 && (
              <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">{activeCount}</span>
            )}
          </div>
          {content}
        </div>
      </div>
    )
  }

  // Mobile drawer
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={onClose} />
        <motion.div
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-h-[80vh] bg-surface-900 border-t border-surface-700 rounded-t-2xl overflow-y-auto"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-800">
            <span className="text-sm font-semibold text-white">Filters & Sort</span>
            <button onClick={onClose} className="text-surface-400 hover:text-white text-lg">✕</button>
          </div>
          {content}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left mb-3"
      >
        <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">{title}</span>
        <span className={`text-surface-500 text-xs transition-transform ${open ? '' : '-rotate-90'}`}>▼</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}