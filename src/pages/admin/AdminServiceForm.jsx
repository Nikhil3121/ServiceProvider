// src/pages/admin/AdminServiceForm.jsx
import { useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Upload, X, Plus, Save, Star, Eye, Trash2, GripVertical
} from 'lucide-react'
import toast from 'react-hot-toast'
import { projectApi } from '@/services/api'
import useAuthStore from '@/store/authStore'
import { getErrorMessage } from '@/utils'
import { FormField, Input, Textarea, Select } from '@/components/ui/FormField'
import Spinner from '@/components/ui/PageLoader'

const schema = z.object({
  title:            z.string().min(3, 'Title must be at least 3 characters').max(120),
  description:      z.string().min(20, 'Description must be at least 20 characters').max(5000),
  shortDescription: z.string().max(300).optional(),
  category:         z.string().min(2, 'Category is required').max(60),
  tags:             z.string().optional(),
  pricingType:      z.enum(['fixed', 'hourly', 'monthly', 'custom', 'free']),
  pricingAmount:    z.coerce.number().min(0).optional(),
  pricingCurrency:  z.string().default('INR'),
  pricingLabel:     z.string().optional(),
  isActive:         z.boolean().default(true),
  isFeatured:       z.boolean().default(false),
  metaTitle:        z.string().max(120).optional(),
  metaDescription:  z.string().max(300).optional(),
})

const CATEGORIES = ['Web Development', 'Mobile Apps', 'UI/UX Design', 'Digital Marketing', 'Consulting', 'Branding', 'SEO', 'Content', 'Photography', 'Other']

export default function AdminServiceForm() {
  const { id } = useParams()
  const isEdit  = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const fileRef = useRef(null)
  const [images, setImages]         = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [features, setFeatures]     = useState([''])

  const { data: existingData, isLoading: loadingExisting } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectApi.get(id),
    enabled: isEdit,
    onSuccess: ({ data }) => {
      const p = data.data
      setImagePreviews(p.images?.map((img) => ({ url: img.url, publicId: img.publicId, existing: true })) || [])
      setFeatures(p.features?.length ? p.features : [''])
      reset({
        title:            p.title,
        description:      p.description,
        shortDescription: p.shortDescription || '',
        category:         p.category,
        tags:             p.tags?.join(', ') || '',
        pricingType:      p.pricing?.type || 'fixed',
        pricingAmount:    p.pricing?.amount || 0,
        pricingCurrency:  p.pricing?.currency || 'INR',
        pricingLabel:     p.pricing?.label || '',
        isActive:         p.isActive,
        isFeatured:       p.isFeatured,
        metaTitle:        p.metaTitle || '',
        metaDescription:  p.metaDescription || '',
      })
    },
  })

  const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { pricingType: 'fixed', pricingCurrency: 'INR', isActive: true, isFeatured: false },
  })

  const pricingType = watch('pricingType')

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: (formData) =>
      isEdit ? projectApi.update(id, formData) : projectApi.create(formData),
    onSuccess: ({ data }) => {
      qc.invalidateQueries({ queryKey: ['admin-projects'] })
      qc.invalidateQueries({ queryKey: ['project-categories'] })
      if (isEdit) qc.invalidateQueries({ queryKey: ['project', id] })
      toast.success(isEdit ? 'Service updated!' : 'Service created!')
      navigate('/admin/services')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const handleFiles = (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (images.length + files.length > 8) { toast.error('Maximum 8 images'); return }
    const newPreviews = files.map((f) => ({ url: URL.createObjectURL(f), file: f }))
    setImages((prev) => [...prev, ...files])
    setImagePreviews((prev) => [...prev, ...newPreviews])
  }

  const removeImage = (i) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i))
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  const addFeature = () => setFeatures((prev) => [...prev, ''])
  const removeFeature = (i) => setFeatures((prev) => prev.filter((_, idx) => idx !== i))
  const updateFeature = (i, val) => setFeatures((prev) => { const next = [...prev]; next[i] = val; return next })

  const onSubmit = (values) => {
    const form = new FormData()
    // Text fields
    form.append('title',            values.title)
    form.append('description',      values.description)
    if (values.shortDescription) form.append('shortDescription', values.shortDescription)
    form.append('category',         values.category)
    if (values.tags) {
      const tags = values.tags.split(',').map((t) => t.trim()).filter(Boolean)
      tags.forEach((t) => form.append('tags[]', t))
    }
    form.append('pricing[type]',    values.pricingType)
    form.append('pricing[amount]',  values.pricingAmount || 0)
    form.append('pricing[currency]',values.pricingCurrency)
    if (values.pricingLabel) form.append('pricing[label]', values.pricingLabel)
    form.append('isActive',         values.isActive)
    form.append('isFeatured',       values.isFeatured)
    if (values.metaTitle) form.append('metaTitle', values.metaTitle)
    if (values.metaDescription) form.append('metaDescription', values.metaDescription)
    // Features
    features.filter(Boolean).forEach((f) => form.append('features[]', f))
    // Images
    images.forEach((file) => form.append('images', file))

    save(form)
  }

  if (isEdit && loadingExisting) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-surface-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin/services" className="p-2 rounded-xl hover:bg-surface-100 text-surface-500 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-semibold text-surface-900">
            {isEdit ? 'Edit service' : 'New service'}
          </h1>
          <p className="text-surface-500 text-sm mt-0.5">
            {isEdit ? 'Update service details and images' : 'Fill in the details for your new service'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <div className="card card-body space-y-4">
              <h2 className="font-semibold text-surface-900">Basic information</h2>
              <FormField label="Service title" error={errors.title?.message} required>
                <Input {...register('title')} placeholder="e.g., Full-Stack Web Development" error={errors.title?.message} />
              </FormField>
              <FormField label="Short description" error={errors.shortDescription?.message}>
                <Input {...register('shortDescription')} placeholder="One-line summary (shown in cards)" />
              </FormField>
              <FormField label="Full description" error={errors.description?.message} required>
                <Textarea {...register('description')} rows={6} placeholder="Describe your service in detail…" error={errors.description?.message} />
              </FormField>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Category" error={errors.category?.message} required>
                  <Select {...register('category')} error={errors.category?.message}>
                    <option value="">Select category…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </FormField>
                <FormField label="Tags" hint="Comma-separated: react, nodejs">
                  <Input {...register('tags')} placeholder="react, nodejs, mongodb" />
                </FormField>
              </div>
            </div>

            {/* Images */}
            <div className="card card-body space-y-4">
              <h2 className="font-semibold text-surface-900">Images</h2>
              <div
                className="border-2 border-dashed border-surface-200 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer"
                onClick={() => fileRef.current?.click()}
                onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
                onDragOver={(e) => e.preventDefault()}
              >
                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                <Upload size={24} className="mx-auto mb-3 text-surface-400" />
                <p className="text-sm font-medium text-surface-700">Drop images here or click to upload</p>
                <p className="text-xs text-surface-400 mt-1">JPG, PNG, WebP · Max 5MB each · Up to 8 images</p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {imagePreviews.map((img, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden aspect-square bg-surface-100">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      {i === 0 && <span className="absolute bottom-1 left-1 badge bg-accent-400 text-accent-900 text-[9px]">Primary</span>}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="card card-body space-y-4">
              <h2 className="font-semibold text-surface-900">What's included</h2>
              <div className="space-y-2">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={f}
                      onChange={(e) => updateFeature(i, e.target.value)}
                      placeholder={`Feature ${i + 1}…`}
                      className="flex-1"
                    />
                    <button type="button" onClick={() => removeFeature(i)} className="p-2.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <X size={15} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addFeature} className="btn-ghost btn-sm w-full border border-dashed border-surface-200 hover:border-primary-300">
                  <Plus size={14} /> Add feature
                </button>
              </div>
            </div>

            {/* SEO */}
            <div className="card card-body space-y-4">
              <h2 className="font-semibold text-surface-900">SEO metadata <span className="text-xs font-normal text-surface-400">(optional)</span></h2>
              <FormField label="Meta title">
                <Input {...register('metaTitle')} placeholder="SEO page title" />
              </FormField>
              <FormField label="Meta description">
                <Textarea {...register('metaDescription')} rows={2} placeholder="SEO description for search engines" />
              </FormField>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            {/* Publish */}
            <div className="card card-body space-y-4">
              <h2 className="font-semibold text-surface-900">Publish</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-surface-50 rounded-xl cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-surface-900">Active</p>
                    <p className="text-xs text-surface-500">Visible on public pages</p>
                  </div>
                  <input type="checkbox" {...register('isActive')} className="w-4 h-4 accent-primary-600" />
                </label>
                <label className="flex items-center justify-between p-3 bg-surface-50 rounded-xl cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-surface-900 flex items-center gap-1.5">
                      <Star size={13} className="text-accent-500" /> Featured
                    </p>
                    <p className="text-xs text-surface-500">Show on homepage</p>
                  </div>
                  <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 accent-primary-600" />
                </label>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-surface-100">
                <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
                  {saving
                    ? <><Spinner size="sm" className="border-white/30 border-t-white" /> Saving…</>
                    : <><Save size={15} /> {isEdit ? 'Update service' : 'Create service'}</>
                  }
                </button>
                <Link to="/admin/services" className="btn-ghost btn-sm w-full justify-center">
                  Cancel
                </Link>
              </div>
            </div>

            {/* Pricing */}
            <div className="card card-body space-y-4">
              <h2 className="font-semibold text-surface-900">Pricing</h2>
              <FormField label="Pricing type" error={errors.pricingType?.message}>
                <Select {...register('pricingType')}>
                  {['fixed','hourly','monthly','custom','free'].map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </Select>
              </FormField>
              {pricingType !== 'free' && pricingType !== 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Amount">
                    <Input {...register('pricingAmount')} type="number" min="0" placeholder="0" />
                  </FormField>
                  <FormField label="Currency">
                    <Select {...register('pricingCurrency')}>
                      <option value="INR">INR ₹</option>
                      <option value="USD">USD $</option>
                      <option value="EUR">EUR €</option>
                      <option value="GBP">GBP £</option>
                    </Select>
                  </FormField>
                </div>
              )}
              <FormField label="Price label" hint='e.g., "Starting from"'>
                <Input {...register('pricingLabel')} placeholder="Starting from" />
              </FormField>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
