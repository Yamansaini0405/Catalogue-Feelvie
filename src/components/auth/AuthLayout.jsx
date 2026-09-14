import { BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import feelVieLogo from '../../assets/feelVie.png'
import coverImage from '../../assets/cover.jpg'
import { ROUTES } from '../../constants/routes'

const HIGHLIGHTS = [
  { icon: Sparkles, text: 'Publish new arrivals with rich variant & rental options' },
  { icon: ShieldCheck, text: 'Your catalogue, protected behind secure boutique-only access' },
  { icon: BadgeCheck, text: 'One dashboard for categories, colors, sizes and stock' },
]

export default function AuthLayout({ title, subtitle, children }) {
  const location = useLocation()
  const isRegister = location.pathname === ROUTES.REGISTER

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950 to-brand-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <img src={coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="relative">
          <img src={feelVieLogo} alt="FeelVie" className="h-9 w-auto brightness-0 invert" />
        </div>
        <div className="relative space-y-6">
          <p className="font-display text-3xl font-semibold leading-tight text-white">
            The boutique catalogue panel, built for makers who move fast.
          </p>
          <div className="space-y-3">
            {HIGHLIGHTS.map((item) => {
              const HighlightIcon = item.icon
              return (
                <div key={item.text} className="flex items-start gap-3 text-sm text-brand-100/90">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <HighlightIcon size={13} />
                  </span>
                  <span>{item.text}</span>
                </div>
              )
            })}
          </div>
        </div>
        <p className="relative text-xs text-brand-200/70">© {new Date().getFullYear()} FeelVie. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <img src={feelVieLogo} alt="FeelVie" className="h-8 w-auto lg:hidden" />

          <div className="mt-8 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            <Link
              to={ROUTES.REGISTER}
              className={`rounded-lg px-3 py-2 text-center text-sm font-semibold transition ${
                isRegister ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className={`rounded-lg px-3 py-2 text-center text-sm font-semibold transition ${
                !isRegister ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Login
            </Link>
          </div>

          <div className="mt-7">
            <h1 className="font-display text-2xl font-semibold text-slate-900">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  )
}
