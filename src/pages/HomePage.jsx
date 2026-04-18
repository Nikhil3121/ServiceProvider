// src/pages/HomePage.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Zap, Shield, Clock, Star, ChevronRight } from 'lucide-react'
import { projectApi } from '@/services/api'
import { formatCurrency, truncate } from '@/utils'
import { CardSkeleton } from '@/components/ui/Skeleton'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const FEATURES = [
  { icon: Zap,    title: 'Fast Delivery',    desc: 'Projects delivered on time, every time. We respect your deadlines.' },
  { icon: Shield, title: 'Quality Assured',  desc: 'Every deliverable is reviewed, tested, and refined before handoff.' },
  { icon: Clock,  title: '24/7 Support',     desc: 'Our team is always available to answer questions and provide updates.' },
]

function ServiceCard({ project }) {
  return (
    <motion.div variants={fadeUp} className="card-hover group flex flex-col">
      <div className="relative overflow-hidden rounded-t-2xl h-44 bg-gradient-to-br from-primary-100 to-primary-200">
        {project.images?.[0]?.url ? (
          <img src={project.images[0].url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">💼</span>
          </div>
        )}
        {project.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="badge bg-accent-400 text-accent-900 gap-1"><Star size={10} fill="currentColor" /> Featured</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="badge-primary">{project.category}</span>
        </div>
      </div>
      <div className="card-body flex-1 flex flex-col pt-5">
        <h3 className="font-display text-lg font-semibold text-surface-900 group-hover:text-primary-700 transition-colors mb-2 leading-snug">
          {project.title}
        </h3>
        <p className="text-sm text-surface-500 leading-relaxed flex-1">{truncate(project.shortDescription || project.description, 100)}</p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-surface-100">
          <div>
            <p className="text-xs text-surface-400 mb-0.5">Starting from</p>
            <p className="font-semibold text-surface-900">
              {project.pricing?.type === 'free' ? 'Free' : formatCurrency(project.pricing?.amount, project.pricing?.currency)}
            </p>
          </div>
          <Link to={`/services/${project.slug || project._id}`} className="btn-outline btn-sm group-hover:bg-primary-700 group-hover:text-white group-hover:border-primary-700 transition-all">
            View details <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function HomePage() {
  const { ref: featRef, inView: featInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: svcRef,  inView: svcInView  } = useInView({ triggerOnce: true, threshold: 0.05 })

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['projects', { featured: true, limit: 3 }],
    queryFn: () => projectApi.list({ featured: true, limit: 3 }),
  })

  const services = servicesData?.data?.data || []

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center pt-16 bg-gradient-to-b from-primary-950 via-primary-900 to-surface-900">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="absolute inset-0 bg-noise" />
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

        <div className="container-page relative py-24">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-8">
                <span className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-pulse" />
                Professional Services Platform
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-display font-semibold text-white leading-tight text-balance mb-6">
              Services built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
                ambitious
              </span>{' '}
              businesses
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-white/60 leading-relaxed max-w-xl mx-auto mb-10">
              From strategy to execution — we deliver expert professional services that transform your vision into measurable results.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/services" className="btn-primary btn-lg bg-white text-primary-900 hover:bg-surface-100 shadow-lg">
                Explore services <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn-lg border border-white/20 text-white hover:bg-white/10 transition-all rounded-2xl">
                Talk to us
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center justify-center gap-8 mt-14 pt-10 border-t border-white/10">
              {[['2,000+', 'Happy clients'], ['98%', 'Satisfaction rate'], ['150+', 'Projects delivered']].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="text-2xl font-display font-semibold text-white">{n}</p>
                  <p className="text-xs text-white/50 mt-0.5">{l}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Gradient fade to next section */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-surface-50 to-transparent" />
      </section>

      {/* ── Features ── */}
      <section ref={featRef} className="py-24 bg-surface-50">
        <div className="container-page">
          <motion.div variants={stagger} initial="hidden" animate={featInView ? 'show' : 'hidden'} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-3">Why Nexus</motion.p>
            <motion.h2 variants={fadeUp} className="section-title">Everything you need to succeed</motion.h2>
            <motion.p variants={fadeUp} className="section-subtitle mx-auto mt-3">
              We combine expertise, technology, and dedication to deliver exceptional results.
            </motion.p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" animate={featInView ? 'show' : 'hidden'} className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="card card-body group hover:border-primary-200 hover:shadow-glow-sm transition-all duration-300">
                <div className="w-11 h-11 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary-700 group-hover:text-white transition-all duration-300">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-lg font-semibold text-surface-900 mb-2">{title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Services ── */}
      <section ref={svcRef} className="py-24 bg-white">
        <div className="container-page">
          <motion.div variants={stagger} initial="hidden" animate={svcInView ? 'show' : 'hidden'}>
            <motion.div variants={fadeUp} className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-3">Our Work</p>
                <h2 className="section-title">Featured services</h2>
              </div>
              <Link to="/services" className="btn-outline hidden sm:inline-flex">
                View all <ArrowRight size={16} />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
                : services.map((s) => <ServiceCard key={s._id} project={s} />)
              }
            </div>

            <motion.div variants={fadeUp} className="mt-8 text-center sm:hidden">
              <Link to="/services" className="btn-outline">View all services <ArrowRight size={16} /></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-50" />
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary-700/40 rounded-full blur-3xl" />
        <div className="container-page relative text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl md:text-5xl font-display font-semibold text-white mb-5">Ready to get started?</h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">Join thousands of businesses that trust Nexus for their professional service needs.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth/signup" className="btn-primary btn-lg bg-white text-primary-900 hover:bg-surface-100">
                Start free today <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn-lg border border-white/25 text-white hover:bg-white/10 rounded-2xl transition-all">
                Contact sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
