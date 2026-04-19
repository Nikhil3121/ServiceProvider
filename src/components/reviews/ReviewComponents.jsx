// src/components/reviews/StarRating.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'

export function StarRating({ value = 0, onChange, readOnly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0)
  const sizes = { sm: 'text-sm', md: 'text-xl', lg: 'text-2xl' }

  return (
    <div className="flex items-center gap-0.5" role={readOnly ? 'img' : 'radiogroup'} aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = readOnly ? star <= value : star <= (hovered || value)
        return (
          <motion.button
            key={star}
            type="button"
            whileTap={readOnly ? {} : { scale: 1.3 }}
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            className={`${sizes[size]} transition-colors duration-100 ${
              readOnly ? 'cursor-default' : 'cursor-pointer focus:outline-none'
            } ${filled ? 'text-amber-400' : 'text-surface-700'}`}
            aria-label={`${star} star`}
            disabled={readOnly}
          >
            ★
          </motion.button>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────
// src/components/reviews/ReviewCard.jsx
import { StarRating } from './StarRating'

export function ReviewCard({ review }) {
  const { author, avatar, rating, comment, date, serviceType } = review

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-900 border border-surface-800 rounded-2xl p-5 hover:border-surface-700 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-300 font-semibold text-sm flex-shrink-0">
            {avatar || author?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{author}</p>
            {serviceType && (
              <span className="text-xs text-surface-500">{serviceType}</span>
            )}
          </div>
        </div>
        <StarRating value={rating} readOnly size="sm" />
      </div>

      <p className="text-sm text-surface-300 leading-relaxed mb-3">{comment}</p>

      <p className="text-xs text-surface-500">{date}</p>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// src/components/reviews/WriteReviewModal.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StarRating } from './StarRating'
import { toast } from 'sonner'

export function WriteReviewModal({ isOpen, onClose, serviceId, providerName, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return toast.error('Please select a rating')
    if (comment.trim().length < 10) return toast.error('Please write at least 10 characters')
    setLoading(true)
    try {
      await onSubmit({ rating, comment, serviceId })
      toast.success('Review submitted! Thank you.')
      onClose()
    } catch {
      toast.error('Failed to submit review. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-surface-900 border border-surface-700 rounded-2xl p-6 w-full max-w-md z-10"
          >
            <h2 className="text-lg font-semibold text-white mb-1">Write a Review</h2>
            <p className="text-sm text-surface-400 mb-5">How was your experience with {providerName}?</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-surface-300 mb-2 block">Your Rating</label>
                <StarRating value={rating} onChange={setRating} size="lg" />
              </div>

              <div>
                <label className="text-sm text-surface-300 mb-2 block">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none text-sm transition-all"
                />
                <p className="text-xs text-surface-500 mt-1">{comment.length}/500 characters</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-surface-700 text-surface-300 hover:bg-surface-800 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !rating}
                  className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all text-sm"
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}