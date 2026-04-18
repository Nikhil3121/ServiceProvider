// src/components/ui/FormField.jsx
import { forwardRef } from 'react'
import { cn } from '@/utils'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export const FormField = ({ label, error, hint, required, className, children }) => (
  <div className={cn('space-y-1', className)}>
    {label && (
      <label className="form-label">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
    )}
    {children}
    {error && (
      <p className="form-error">
        <AlertCircle size={11} className="shrink-0" />
        {error}
      </p>
    )}
    {hint && !error && <p className="form-hint">{hint}</p>}
  </div>
)

export const Input = forwardRef(({ error, className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(error ? 'form-input-error' : 'form-input', className)}
    {...props}
  />
))
Input.displayName = 'Input'

export const PasswordInput = forwardRef(({ error, className, ...props }, ref) => {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        ref={ref}
        type={show ? 'text' : 'password'}
        className={cn(error ? 'form-input-error' : 'form-input', 'pr-10', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700 transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
})
PasswordInput.displayName = 'PasswordInput'

export const Textarea = forwardRef(({ error, className, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={4}
    className={cn(error ? 'form-input-error' : 'form-input', 'resize-none', className)}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export const Select = forwardRef(({ error, className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(error ? 'form-input-error' : 'form-input', 'cursor-pointer', className)}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = 'Select'

export default FormField
