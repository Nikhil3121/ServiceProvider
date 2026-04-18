// src/pages/ContactPage.jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { contactApi } from '@/services/api'
import { getErrorMessage } from '@/utils'
import { FormField, Input, Textarea } from '@/components/ui/FormField'
import Spinner from '@/components/ui/PageLoader'

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Enter a valid email'),
  phone:   z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

const INFO = [
  { icon: Mail,    label: 'Email',    value: 'hello@nexus.com' },
  { icon: Phone,   label: 'Phone',    value: '+91 98765 43210' },
  { icon: MapPin,  label: 'Location', value: 'Mumbai, India' },
]

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data) => contactApi.submit({ ...data, captchaToken: 'skip' }),
    onSuccess: () => { reset(); toast.success('Message sent! We\'ll reply within 24 hours.') },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return (
    <div className="pt-24 pb-20 bg-surface-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 py-10">
        <div className="container-page text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-3">Get in touch</p>
          <h1 className="section-title mb-3">Contact us</h1>
          <p className="section-subtitle mx-auto">Have a project in mind? We'd love to hear about it.</p>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="grid lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Info */}
          <div className="space-y-5">
            {INFO.map(({ icon: Icon, label, value }) => (
              <motion.div key={label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="card card-body p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary-700" />
                </div>
                <div>
                  <p className="text-xs text-surface-400 uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-surface-900">{value}</p>
                </div>
              </motion.div>
            ))}

            <div className="card card-body p-5">
              <p className="text-xs text-surface-400 uppercase tracking-wide mb-3">Business hours</p>
              <div className="space-y-1.5">
                {[['Monday – Friday', '9:00 AM – 7:00 PM'], ['Saturday', '10:00 AM – 4:00 PM'], ['Sunday', 'Closed']].map(([day, time]) => (
                  <div key={day} className="flex items-center justify-between text-sm">
                    <span className="text-surface-600">{day}</span>
                    <span className="text-surface-900 font-medium">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card card-body">
              {isSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Check size={28} className="text-green-600" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-surface-900 mb-2">Message sent!</h3>
                  <p className="text-surface-500 text-sm">We'll get back to you within 24–48 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Full name" error={errors.name?.message} required>
                      <Input {...register('name')} placeholder="John Doe" error={errors.name?.message} />
                    </FormField>
                    <FormField label="Email address" error={errors.email?.message} required>
                      <Input {...register('email')} type="email" placeholder="you@company.com" error={errors.email?.message} />
                    </FormField>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Phone number" error={errors.phone?.message}>
                      <Input {...register('phone')} type="tel" placeholder="+91 98765 43210" />
                    </FormField>
                    <FormField label="Subject" error={errors.subject?.message}>
                      <Input {...register('subject')} placeholder="Project inquiry" />
                    </FormField>
                  </div>
                  <FormField label="Message" error={errors.message?.message} required>
                    <Textarea {...register('message')} rows={5} placeholder="Tell us about your project…" error={errors.message?.message} />
                  </FormField>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-surface-400">We reply within 24–48 business hours</p>
                    <button type="submit" disabled={isPending} className="btn-primary">
                      {isPending
                        ? <Spinner size="sm" className="border-white/30 border-t-white" />
                        : <><Send size={15} /><span>Send message</span></>
                      }
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
