// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom'
import { Instagram, Mail } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const cols = [
  { title: 'Services', links: [['Web Development', '/services'], ['Mobile Apps', '/services'], ['UI/UX Design', '/services'], ['Consulting', '/services']] },
  { title: 'Company',  links: [['About Us', '/about'], ['Contact', '/contact'], ['Blog', '/blog'], ['Careers', '/careers']] },
  { title: 'Legal',    links: [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Cookie Policy', '/cookies']] },
]

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-white">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Logo variant="light" className="mb-5" />
            <p className="text-surface-400 text-sm leading-relaxed max-w-xs">
              Professional services platform delivering excellence for businesses that refuse to settle for ordinary.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-surface-800 hover:bg-primary-700 flex items-center justify-center text-surface-400 hover:text-white transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {cols.map(({ title, links }) => (
            <div key={title}>
              <p className="text-xs font-semibold uppercase tracking-widest text-surface-400 mb-4">{title}</p>
              <ul className="space-y-3">
                {links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-surface-400 hover:text-white transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-surface-500 text-sm">© {new Date().getFullYear()} Nexus. All rights reserved.</p>
          <p className="text-surface-600 text-xs">Built with precision · Deployed with confidence</p>
        </div>
      </div>
    </footer>
  )
}
