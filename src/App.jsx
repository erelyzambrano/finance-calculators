import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const calculators = {
  core: [
    {
      path: '/tvm',
      title: 'Time Value of Money',
      description: 'Solve for any variable: present value, future value, payment, number of periods, or interest rate.',
      icon: '∑'
    },
    {
      path: '/amortization',
      title: 'Amortization Calculator',
      description: 'Build a full amortization schedule. See your principal and interest breakdown month by month.',
      icon: '📊'
    },
    {
      path: '/fv-series',
      title: 'Future Value of Series',
      description: 'Project the growth of recurring contributions. Watch your savings accumulate over time.',
      icon: '📈'
    }
  ],
  extended: [
    {
      path: '/retirement',
      title: 'Retirement Savings Projection',
      description: 'Estimate your nest egg at retirement. Combine current savings, contributions, and return assumptions.',
      icon: '🎯'
    },
    {
      path: '/rmd',
      title: 'RMD Calculator',
      description: 'Calculate required minimum distributions using the IRS Uniform Lifetime Table.',
      icon: '📋'
    },
    {
      path: '/tey',
      title: 'Tax-Equivalent Yield',
      description: 'Compare municipal bond yields to taxable equivalents. Find the better fit for your tax bracket.',
      icon: '💰'
    }
  ]
}

export default function App() {
  return (
    <div className="min-h-screen bg-cream bg-grain">
      <header className="border-b border-border bg-cream/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-fraunces italic text-ink">Finance Calculators</h1>
          <p className="text-ink-mute mt-2 text-sm">Professional tools for financial planning conversations</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <section className="mb-20">
          <div className="mb-8">
            <p className="eyebrow text-copper mb-2">Core Planning</p>
            <h2 className="text-2xl font-fraunces italic text-ink">Fundamental Calculators</h2>
            <div className="h-0.5 bg-border mt-4 mb-8 max-w-16"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {calculators.core.map((calc) => (
              <CalculatorCard key={calc.path} {...calc} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8">
            <p className="eyebrow text-copper mb-2">Extended Planning</p>
            <h2 className="text-2xl font-fraunces italic text-ink">Advanced Scenarios</h2>
            <div className="h-0.5 bg-border mt-4 mb-8 max-w-16"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {calculators.extended.map((calc) => (
              <CalculatorCard key={calc.path} {...calc} />
            ))}
          </div>
        </section>

        <footer className="mt-24 pt-8 border-t border-border text-center">
          <p className="text-sm text-ink-mute">
            All calculators are for illustrative purposes only. Not financial advice. Results depend on accuracy of inputs and reasonableness of assumptions.
          </p>
        </footer>
      </main>
    </div>
  )
}

function CalculatorCard({ path, title, description, icon }) {
  return (
    <Link to={path}>
      <div className="card group h-full hover:shadow-warm-lg transition-shadow duration-200">
        <div className="text-3xl mb-4 opacity-60">{icon}</div>
        <h3 className="text-lg font-fraunces italic text-ink mb-3">{title}</h3>
        <p className="text-sm text-ink-mute mb-4">{description}</p>
        <div className="flex items-center text-forest group-hover:translate-x-1 transition-transform">
          <span className="text-xs uppercase tracking-widest font-medium">Open</span>
          <ChevronRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </Link>
  )
}
