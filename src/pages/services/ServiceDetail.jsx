// src/pages/services/ServiceDetail.jsx
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Star, ArrowRight, Eye } from 'lucide-react'
import { projectApi } from '@/services/api'
import { formatCurrency, formatDate } from '@/utils'
import { Skeleton } from '@/components/ui/Skeleton'

function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0)
  if (!images?.length) return (
    <div className="w-full h-80 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-6xl">💼</div>
  )
  return (
    <div className="relative rounded-2xl overflow-hidden bg-surface-100">
      <div className="relative h-80 sm:h-[420px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current].url}
            alt={images[current].alt || ''}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-xl flex items-center justify-center shadow-md transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setCurrent((c) => (c + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-xl flex items-center justify-center shadow-md transition-all">
              <ChevronRight size={18} />
            </button>
          </>
        )}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === current ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => projectApi.get(slug),
  })

  const project = data?.data?.data

  if (isLoading) return (
    <div className="pt-24 pb-20 container-page">
      <div className="grid lg:grid-cols-5 gap-10 mt-8">
        <div className="lg:col-span-3 space-y-4">
          <Skeleton className="h-[420px] w-full rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-lg" />
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-3/4 rounded-xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )

  if (isError || !project) return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h2 className="text-2xl font-display font-semibold mb-3">Service not found</h2>
        <Link to="/services" className="btn-primary">Browse all services</Link>
      </div>
    </div>
  )

  return (
    <div className="pt-24 pb-20 bg-surface-50 min-h-screen">
      <div className="container-page">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-surface-500 py-6">
          <Link to="/" className="hover:text-primary-700 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/services" className="hover:text-primary-700 transition-colors">Services</Link>
          <ChevronRight size={14} />
          <span className="text-surface-800 font-medium truncate max-w-xs">{project.title}</span>
        </nav>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left: Images + Description */}
          <div className="lg:col-span-3 space-y-8">
            <ImageCarousel images={project.images} />

            <div className="card card-body">
              <h2 className="font-display text-xl font-semibold text-surface-900 mb-4">About this service</h2>
              <p className="text-surface-600 leading-relaxed whitespace-pre-wrap text-sm">{project.description}</p>

              {project.features?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-surface-900 mb-3">What's included</h3>
                  <ul className="space-y-2">
                    {project.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-surface-700">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={11} className="text-green-600" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.tags?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span key={t} className="px-3 py-1 bg-surface-100 text-surface-600 rounded-full text-xs">#{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Pricing card */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="card card-body">
                {project.isFeatured && (
                  <div className="flex items-center gap-1.5 text-accent-600 text-sm font-medium mb-3">
                    <Star size={14} fill="currentColor" /> Featured service
                  </div>
                )}
                <span className="badge-primary mb-3">{project.category}</span>
                <h1 className="font-display text-2xl font-semibold text-surface-900 leading-snug mb-4">{project.title}</h1>

                {project.shortDescription && (
                  <p className="text-surface-500 text-sm leading-relaxed mb-5">{project.shortDescription}</p>
                )}

                <div className="py-5 border-y border-surface-100 mb-5">
                  <p className="text-xs text-surface-400 uppercase tracking-wide mb-1">
                    {project.pricing?.label || 'Starting from'}
                  </p>
                  <p className="text-3xl font-display font-bold text-surface-900">
                    {project.pricing?.type === 'free' ? 'Free'
                      : project.pricing?.type === 'custom' ? 'Custom quote'
                      : formatCurrency(project.pricing?.amount, project.pricing?.currency)}
                  </p>
                  {project.pricing?.type !== 'fixed' && project.pricing?.type !== 'free' && project.pricing?.type !== 'custom' && (
                    <p className="text-xs text-surface-400 mt-1">per {project.pricing?.type}</p>
                  )}
                </div>

                <Link to="/contact" className="btn-primary btn-lg w-full justify-center">
                  Get started <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn-secondary w-full justify-center mt-2">
                  Request a quote
                </Link>

                <div className="mt-5 flex items-center gap-2 justify-center text-xs text-surface-400">
                  <Eye size={13} />
                  <span>{project.viewCount || 0} views</span>
                  <span>·</span>
                  <span>Added {formatDate(project.createdAt)}</span>
                </div>
              </div>

              <div className="card card-body p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-surface-400 mb-3">Satisfaction guarantee</p>
                {['100% money-back guarantee', 'Free revisions included', 'Dedicated support'].map((item) => (
                  <div key={item} className="flex items-center gap-2 mb-2 last:mb-0">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span className="text-sm text-surface-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
