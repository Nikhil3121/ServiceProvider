// src/pages/HomePage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";

const STATS = [
  { value: "10+", label: "Verified Providers" },
  { value: "10+", label: "Jobs Completed" },
  { value: "4.9★", label: "Average Rating" },
  { value: "10+", label: "Service Categories" },
];

const CATEGORIES = [
  { icon: "🌐", name: "Web Development", count: "25+ projects" },
  { icon: "📱", name: "Mobile Apps", count: "5+ apps built" },
  { icon: "🎨", name: "UI/UX Design", count: "150+ designs" },
  { icon: "💼", name: "Consulting", count: "10+ clients" },
];

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "Startup Founder, Delhi",
    avatar: "RS",
    rating: 4,
    text: "The website was delivered exactly as I envisioned. Fast, responsive, and optimized for conversions. It gave my startup a strong online presence.",
    color: "#6366f1",
  },
  {
    name: "Priya Mehta",
    role: "Product Manager, Mumbai",
    avatar: "PM",
    rating: 4,
    text: "Our mobile app turned out amazing. Smooth performance, great UI, and delivered on time. The whole development process was very professional.",
    color: "#0ea5e9",
  },
  {
    name: "Amit Verma",
    role: "Design Lead, Bangalore",
    avatar: "AV",
    rating: 5,
    text: "The UI/UX designs were clean and user-friendly. It significantly improved our product experience and user engagement.",
    color: "#10b981",
  },
  {
    name: "Sneha Kapoor",
    role: "Business Owner, Gurgaon",
    avatar: "SK",
    rating: 5,
    text: "The consulting sessions were extremely valuable. We got clear strategies that helped us scale faster and avoid costly mistakes.",
    color: "#f59e0b",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Search a Service",
    desc: "Browse 120+ categories or search for exactly what you need.",
  },
  {
    step: "02",
    title: "Pick a Provider",
    desc: "Compare ratings, prices, and reviews. Book in 60 seconds.",
  },
  {
    step: "03",
    title: "Get it Done",
    desc: "Track your provider live. Pay securely after the job is done.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [count, setCount] = useState({ providers: 0, jobs: 0 });

  // Animated counters
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        setCount({
          providers: Math.floor(10000 * progress),
          jobs: Math.floor(50000 * progress),
        });
        if (step >= steps) clearInterval(interval);
      }, duration / steps);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Nexus — Find Trusted Service Providers Near You</title>
        <meta
          name="description"
          content="Book verified plumbers, electricians, cleaners and more. 10,000+ trusted providers across India."
        />
      </Helmet>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-surface-950 min-h-[92vh] flex items-center">
        {/* Background mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/40 bg-primary-500/10 text-primary-300 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              Trusted by 10+ customers across India
            </motion.span>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              Find the Best{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400">
                Service Providers
              </span>{" "}
              Near You
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-surface-300 max-w-2xl mx-auto mb-10"
            >
              Build powerful digital solutions with expert developers and
              designers. Fast, scalable, and tailored to your business needs.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-12"
            >
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service do you need?"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-800/80 border border-surface-700 text-white placeholder-surface-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-base"
                />
              </div>
              <Link
                to={`/services${searchQuery ? `?q=${searchQuery}` : ""}`}
                className="px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-primary-600/30 active:scale-95 whitespace-nowrap"
              >
                Find Services →
              </Link>
            </motion.div>

            {/* Quick category pills */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="flex flex-wrap justify-center gap-2"
            >
              {[
               "Web Development",
                "Mobile Apps",
                "UI/UX Design",
                "Consulting",


              ].map((cat) => (
                <Link
                  key={cat}
                  to={`/services?category=${cat.toLowerCase()}`}
                  className="px-4 py-2 rounded-full bg-surface-800 hover:bg-surface-700 border border-surface-700 hover:border-surface-600 text-surface-300 hover:text-white text-sm transition-all"
                >
                  {cat}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-surface-900 border-y border-surface-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-surface-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-surface-950 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Browse by Category
              </h2>
              <p className="text-surface-400">
                120+ service categories. All providers verified and rated.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                    activeCategory === cat.name
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-surface-800 bg-surface-900 hover:border-surface-700"
                  }`}
                >
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <div className="font-semibold text-white text-sm mb-1">
                    {cat.name}
                  </div>
                  <div className="text-surface-400 text-xs">{cat.count}</div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="text-center mt-8">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-surface-700 hover:border-surface-600 text-surface-300 hover:text-white transition-all"
              >
                View all 120+ categories →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-surface-900 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                How Nexus Works
              </h2>
              <p className="text-surface-400">
                Book a professional in under 2 minutes
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden sm:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-surface-700 via-primary-600 to-surface-700" />

              {HOW_IT_WORKS.map((step, i) => (
                <motion.div
                  key={step.step}
                  variants={fadeUp}
                  custom={i}
                  className="relative text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary-600/20 border border-primary-500/40 flex items-center justify-center mx-auto mb-5">
                    <span className="text-primary-300 text-lg font-bold">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-surface-950 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                What Our Customers Say
              </h2>
              <p className="text-surface-400">
                Trusted by thousands across India
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -4 }}
                  className="bg-surface-900 border border-surface-800 rounded-2xl p-6 hover:border-surface-700 transition-all"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <span key={j} className="text-amber-400 text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-surface-300 text-sm leading-relaxed mb-5">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{
                        backgroundColor: t.color + "40",
                        border: `1px solid ${t.color}60`,
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">
                        {t.name}
                      </div>
                      <div className="text-surface-500 text-xs">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-gradient-to-r from-primary-700 to-violet-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Are You a Service Provider?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-primary-100 mb-8 max-w-xl mx-auto"
            >
              Join 10,000+ verified professionals on Nexus. Get more clients,
              manage bookings, and grow your business.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={2}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/signup?role=provider"
                className="px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-all active:scale-95"
              >
                Join as a Provider →
              </Link>
              <Link
                to="/services"
                className="px-8 py-4 rounded-xl border border-white/40 text-white hover:bg-white/10 transition-all"
              >
                Browse Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
